#!/usr/bin/env python3
import json
import os
import sqlite3
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlparse


DB_PATH = os.environ.get("PROGRESS_DB_PATH", "/data/progress.sqlite3")
PORT = int(os.environ.get("PROGRESS_API_PORT", "8090"))


def connect():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    with connect() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                external_id TEXT NOT NULL UNIQUE,
                username TEXT NOT NULL,
                email TEXT,
                created_at TEXT NOT NULL,
                last_seen_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS lesson_progress (
                user_id INTEGER NOT NULL,
                course_id TEXT NOT NULL,
                lesson_id TEXT NOT NULL,
                status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed')),
                updated_at TEXT NOT NULL,
                completed_at TEXT,
                PRIMARY KEY (user_id, course_id, lesson_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
            """
        )


def now_iso():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


class ProgressHandler(BaseHTTPRequestHandler):
    server_version = "ProgressAPI/1.0"

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/healthz":
            self.write_text(200, "ok\n")
            return

        user = self.require_user()
        if not user:
            return

        if path == "/api/me":
            self.write_json(200, {"user": self.public_user(user)})
            return

        if path == "/api/progress":
            self.write_json(200, {"user": self.public_user(user), "lessons": self.get_lessons(user["id"])})
            return

        self.write_json(404, {"error": "not_found"})

    def do_PUT(self):
        self.handle_progress_update()

    def do_POST(self):
        self.handle_progress_update()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", self.headers.get("Origin", "*"))
        self.send_header("Access-Control-Allow-Headers", "content-type")
        self.send_header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS")
        self.end_headers()

    def handle_progress_update(self):
        path = urlparse(self.path).path
        parts = [unquote(part) for part in path.split("/") if part]
        is_complete_route = len(parts) == 6 and parts[5] == "complete"
        if len(parts) not in (5, 6) or parts[:3] != ["api", "progress", "lessons"] or (len(parts) == 6 and not is_complete_route):
            self.write_json(404, {"error": "not_found"})
            return

        user = self.require_user()
        if not user:
            return

        course_id = parts[3]
        lesson_id = parts[4]
        payload = self.read_json_body()
        status = payload.get("status")
        if is_complete_route:
            status = "completed"
        if status not in ("in_progress", "completed"):
            self.write_json(400, {"error": "invalid_status"})
            return

        timestamp = now_iso()
        completed_at = timestamp if status == "completed" else None

        with connect() as conn:
            conn.execute(
                """
                INSERT INTO lesson_progress
                    (user_id, course_id, lesson_id, status, updated_at, completed_at)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id, course_id, lesson_id) DO UPDATE SET
                    status = excluded.status,
                    updated_at = excluded.updated_at,
                    completed_at = CASE
                        WHEN excluded.status = 'completed'
                            THEN COALESCE(lesson_progress.completed_at, excluded.completed_at)
                        ELSE NULL
                    END
                """,
                (user["id"], course_id, lesson_id, status, timestamp, completed_at),
            )

        self.write_json(
            200,
            {
                "lesson": {
                    "course_id": course_id,
                    "lesson_id": lesson_id,
                    "status": status,
                    "updated_at": timestamp,
                    "completed_at": completed_at,
                }
            },
        )

    def require_user(self):
        external_id = first_header(
            self.headers,
            [
                "X-Forwarded-User",
                "X-Auth-Request-User",
                "X-Forwarded-Email",
                "X-Auth-Request-Email",
            ],
        )
        email = first_header(self.headers, ["X-Forwarded-Email", "X-Auth-Request-Email"])
        username = first_header(self.headers, ["X-Forwarded-User", "X-Auth-Request-User"]) or email

        if not external_id:
            self.write_json(401, {"error": "missing_authenticated_user"})
            return None

        timestamp = now_iso()
        with connect() as conn:
            conn.execute(
                """
                INSERT INTO users (external_id, username, email, created_at, last_seen_at)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(external_id) DO UPDATE SET
                    username = excluded.username,
                    email = excluded.email,
                    last_seen_at = excluded.last_seen_at
                """,
                (external_id, username or external_id, email, timestamp, timestamp),
            )
            row = conn.execute("SELECT * FROM users WHERE external_id = ?", (external_id,)).fetchone()
            return dict(row)

    def get_lessons(self, user_id):
        with connect() as conn:
            rows = conn.execute(
                """
                SELECT course_id, lesson_id, status, updated_at, completed_at
                FROM lesson_progress
                WHERE user_id = ?
                ORDER BY course_id, lesson_id
                """,
                (user_id,),
            ).fetchall()
        return [
            {
                "course_id": row["course_id"],
                "lesson_id": row["lesson_id"],
                "status": row["status"],
                "updated_at": row["updated_at"],
                "completed_at": row["completed_at"],
            }
            for row in rows
        ]

    def read_json_body(self):
        length = int(self.headers.get("Content-Length", "0") or "0")
        if length == 0:
            return {}
        try:
            return json.loads(self.rfile.read(length).decode("utf-8"))
        except json.JSONDecodeError:
            return {}

    def public_user(self, user):
        return {
            "username": user["username"],
            "email": user["email"],
        }

    def write_json(self, status, payload):
        body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def write_text(self, status, text):
        body = text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/plain")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        print("[%s] %s" % (self.log_date_time_string(), fmt % args), flush=True)


def first_header(headers, names):
    for name in names:
        value = headers.get(name)
        if value:
            return value
    return None


if __name__ == "__main__":
    init_db()
    server = ThreadingHTTPServer(("0.0.0.0", PORT), ProgressHandler)
    print(f"Progress API listening on 0.0.0.0:{PORT}, db={DB_PATH}", flush=True)
    server.serve_forever()
