#!/usr/bin/env python3
"""Build browser lab course manifest and extract legacy quiz blocks.

The source Markdown files use Kramdown-style quiz markers:

    {:.quiz}
    Question text
    - (x) Correct answer
    - ( ) Distractor

This script intentionally uses only the Python standard library so it can run
inside the repository without installing packages.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COURSES_DIR = ROOT / "courses"
CONTENT_DIR = ROOT / "content"

LINUX_COMPLETE_SOURCES = [
    ("2016-10-25-beginner-linux.markdown", "Complete Source: Docker for Beginners - Linux"),
    ("2020-01-01-linux101-landing.markdown", "Complete Source: Linux 101 Landing"),
    ("2020-01-01-linux101-bolum1.markdown", "Complete Source: Operating Systems and Computers"),
    ("2020-01-01-linux101-bolum2-long.markdown", "Complete Source: Shell, Directories, and Files"),
    ("2020-01-01-linux101-bolum2-1.markdown", "Source Segment: Shell and Directory Basics"),
    ("2020-01-01-linux101-bolum2-2.markdown", "Source Segment: Info, Man, Directories, and Files"),
    ("2020-01-01-linux101-bolum2-3.markdown", "Source Segment: Text File Operations"),
    ("2020-01-01-linux101-bolum2-4.markdown", "Source Segment: File Operations and Quiz"),
    ("2020-01-01-linux101-bolum3-long.markdown", "Complete Source: Hardware, Disks, Packages, Processes"),
    ("2020-01-01-linux101-bolum3-1.markdown", "Source Segment: Hardware and Boot"),
    ("2020-01-01-linux101-bolum3-2.markdown", "Source Segment: Filesystems and Packages"),
    ("2020-01-01-linux101-bolum3-3.markdown", "Source Segment: Processes and Quiz"),
    ("2020-01-01-linux101-bolum4-long.markdown", "Complete Source: Users, Vim, and Networking"),
    ("2020-01-01-linux101-bolum4-1.markdown", "Source Segment: Users, Vim, and Network Basics"),
    ("2020-01-01-linux101-bolum4-2.markdown", "Source Segment: Remote Access and Quiz"),
    ("2020-01-01-linux101-bolum5.markdown", "Complete Source: Scripts and Linux Examples"),
]


def linux_complete_lessons() -> list[dict]:
    lessons = []
    for source_file, title in LINUX_COMPLETE_SOURCES:
        stem = Path(source_file).stem
        lessons.append(
            {
                "id": f"linux-source-{stem}",
                "title": title,
                "path": f"linux/complete/{stem}.md",
                "duration_minutes": 45,
                "vm_compatible": "source-material",
                "notes": "Original Linux course material. Some examples may be theory-only or need adaptation for Alpine/v86.",
                "tags": ["linux", "complete-source"],
            }
        )
    return lessons


COURSES = [
    {
        "id": "linux",
        "title": "Linux Essentials",
        "summary": "Command-line navigation, files, permissions, processes, packages, and basic networking for the browser VM.",
        "level": "beginner",
        "vm_profile": "alpine-linux",
        "source_files": [
            source_file for source_file, _title in LINUX_COMPLETE_SOURCES
        ],
        "lessons": [
            {
                "id": "linux-shell-files",
                "title": "Shell, Files, and Permissions",
                "path": "linux/shell-files.md",
                "duration_minutes": 20,
                "vm_compatible": True,
                "tags": ["shell", "files", "permissions"],
            },
            {
                "id": "linux-process-network",
                "title": "Processes, Packages, and Networking",
                "path": "linux/process-network.md",
                "duration_minutes": 25,
                "vm_compatible": True,
                "tags": ["process", "packages", "networking"],
            },
        ]
        + linux_complete_lessons(),
    },
    {
        "id": "git",
        "title": "Git Essentials",
        "summary": "Local repository workflow, commits, history, branches, and recovering context from Git state.",
        "level": "beginner",
        "vm_profile": "alpine-linux",
        "source_files": ["2024-03-29-git101en.markdown"],
        "lessons": [
            {
                "id": "git-local-workflow",
                "title": "Local Git Workflow",
                "path": "git/local-workflow.md",
                "duration_minutes": 20,
                "vm_compatible": True,
                "tags": ["git", "commit", "branch"],
            }
        ],
    },
    {
        "id": "docker",
        "title": "Docker Essentials",
        "summary": "Images, containers, Dockerfiles, volumes, and networking with 32-bit VM constraints called out.",
        "level": "beginner",
        "vm_profile": "alpine-docker-x86",
        "source_files": [
            "2020-01-01-docker101-bolum1.markdown",
            "2020-01-01-docker101-bolum2.markdown",
            "2020-01-01-docker101-bolum3.markdown",
            "2020-01-01-docker101-bolum4.markdown",
        ],
        "lessons": [
            {
                "id": "docker-containers-images",
                "title": "Containers and Images",
                "path": "docker/containers-images.md",
                "duration_minutes": 25,
                "vm_compatible": True,
                "tags": ["docker", "images", "containers"],
            },
            {
                "id": "docker-build-network",
                "title": "Builds, Volumes, and Networking",
                "path": "docker/build-network.md",
                "duration_minutes": 30,
                "vm_compatible": True,
                "tags": ["dockerfile", "volumes", "networking"],
            },
        ],
    },
    {
        "id": "scripting",
        "title": "Bash Scripting",
        "summary": "Variables, arguments, conditionals, loops, file tests, and simple automation in the VM shell.",
        "level": "beginner",
        "vm_profile": "alpine-linux",
        "source_files": ["2021-01-01-scripting101en.markdown"],
        "lessons": [
            {
                "id": "scripting-basics",
                "title": "Bash Script Basics",
                "path": "scripting/basics.md",
                "duration_minutes": 25,
                "vm_compatible": True,
                "tags": ["bash", "variables", "arguments"],
            },
            {
                "id": "scripting-control-flow",
                "title": "Control Flow and File Tests",
                "path": "scripting/control-flow.md",
                "duration_minutes": 30,
                "vm_compatible": True,
                "tags": ["if", "loops", "file-tests"],
            },
        ],
    },
    {
        "id": "database",
        "title": "Database Concepts",
        "summary": "Relational database basics, SQL practice, backup concepts, replication concepts, and NoSQL tradeoffs.",
        "level": "beginner",
        "vm_profile": "alpine-linux",
        "source_files": [
            "2024-04-01-db101en-section1.markdown",
            "2024-04-01-db101en-section2.markdown",
            "2024-04-01-db101en-section3.markdown",
        ],
        "lessons": [
            {
                "id": "database-sql-basics",
                "title": "Relational Databases and SQL",
                "path": "database/sql-basics.md",
                "duration_minutes": 25,
                "vm_compatible": True,
                "tags": ["sql", "mysql", "relational"],
            },
            {
                "id": "database-operations-concepts",
                "title": "Operations and Replication Concepts",
                "path": "database/operations-concepts.md",
                "duration_minutes": 20,
                "vm_compatible": "theory-only",
                "notes": "Heavy MySQL replication labs are theory-only for the browser VM milestone.",
                "tags": ["backup", "replication", "operations"],
            },
        ],
    },
    {
        "id": "kubernetes",
        "title": "Kubernetes Concepts",
        "summary": "Pods, controllers, services, deployment intent, and manifest reading without running a cluster in-browser.",
        "level": "beginner",
        "vm_profile": "theory-only",
        "source_files": ["2020-01-01-k8s101-bolum1.markdown", "2018-04-04-kubernetes-workshop.markdown"],
        "lessons": [
            {
                "id": "kubernetes-core-objects",
                "title": "Core Kubernetes Objects",
                "path": "kubernetes/core-objects.md",
                "duration_minutes": 25,
                "vm_compatible": "theory-only",
                "notes": "Running a Kubernetes control plane is out of scope for the current browser VM.",
                "tags": ["pods", "deployments", "services"],
            }
        ],
    },
]


CHOICE_RE = re.compile(r"^\s*-\s+\((?P<mark>[xX ])\)\s*(?P<text>.+?)\s*$")


def extract_quizzes(course_id: str, source_file: str) -> list[dict]:
    path = CONTENT_DIR / source_file
    if not path.exists():
        return []

    lines = path.read_text(encoding="utf-8").splitlines()
    quizzes: list[dict] = []
    i = 0
    quiz_index = 1
    while i < len(lines):
        if lines[i].strip() != "{:.quiz}":
            i += 1
            continue

        start_line = i + 1
        i += 1
        while i < len(lines) and not lines[i].strip():
            i += 1
        if i >= len(lines):
            break

        question = clean_inline(lines[i])
        i += 1
        choices = []
        while i < len(lines):
            line = lines[i]
            if line.strip() == "{:.quiz}" or line.startswith("## "):
                break
            match = CHOICE_RE.match(line)
            if match:
                choices.append(
                    {
                        "text": clean_inline(match.group("text")),
                        "correct": match.group("mark").lower() == "x",
                    }
                )
            i += 1

        if question and len(choices) >= 2 and any(choice["correct"] for choice in choices):
            quizzes.append(
                {
                    "id": f"{course_id}-{Path(source_file).stem}-{quiz_index:02d}",
                    "course_id": course_id,
                    "source": f"content/{source_file}",
                    "source_line": start_line,
                    "type": "single-choice",
                    "prompt": question,
                    "choices": choices,
                }
            )
            quiz_index += 1
    return quizzes


def clean_inline(value: str) -> str:
    value = re.sub(r"<[^>]+>", "", value)
    value = value.replace("**", "").replace("`", "")
    return re.sub(r"\s+", " ", value).strip()


def build_manifest() -> dict:
    return {
        "schema_version": 1,
        "generated_by": "scripts/build-course-data.py",
        "generated_from": "content/*.markdown",
        "vm_constraints": {
            "guest_os": "Alpine Linux x86",
            "architecture": "32-bit x86/i386",
            "memory": "512 MB",
            "docker_note": "Use i386-compatible images such as i386/alpine. Multi-arch examples may fail if no 386 image exists.",
            "theory_only_note": "Kubernetes control planes and heavy database replication labs are marked theory-only for this milestone.",
        },
        "courses": COURSES,
    }


def sync_complete_linux_sources() -> None:
    target_dir = COURSES_DIR / "linux" / "complete"
    target_dir.mkdir(parents=True, exist_ok=True)

    for source_file, title in LINUX_COMPLETE_SOURCES:
        source_path = CONTENT_DIR / source_file
        if not source_path.exists():
            continue

        body = source_path.read_text(encoding="utf-8", errors="ignore")
        body = re.sub(r"^---\s*\n.*?\n---\s*\n", "", body, count=1, flags=re.S)
        target_path = target_dir / f"{Path(source_file).stem}.md"
        target_path.write_text(
            "---\n"
            f"id: linux-source-{Path(source_file).stem}\n"
            "course_id: linux\n"
            f"title: {json.dumps(title, ensure_ascii=False)}\n"
            "vm_compatible: source-material\n"
            f"source: content/{source_file}\n"
            "---\n\n"
            "> Original Linux source material. Some commands may require adaptation for Alpine Linux or may be theory-only in the browser VM.\n\n"
            + body,
            encoding="utf-8",
        )


def main() -> None:
    sync_complete_linux_sources()

    manifest = build_manifest()
    all_quizzes = []
    for course in COURSES:
        for source_file in course["source_files"]:
            all_quizzes.extend(extract_quizzes(course["id"], source_file))

    quiz_data = {
        "schema_version": 1,
        "generated_by": "scripts/build-course-data.py",
        "quiz_count": len(all_quizzes),
        "quizzes": all_quizzes,
    }

    (COURSES_DIR / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    (COURSES_DIR / "quizzes.json").write_text(
        json.dumps(quiz_data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
