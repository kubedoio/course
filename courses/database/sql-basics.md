---
id: database-sql-basics
course_id: database
title: Relational Databases and SQL
duration_minutes: 25
vm_compatible: true
source:
  - content/2024-04-01-db101en-section1.markdown
---

# Relational Databases and SQL

This milestone focuses on SQL concepts and lightweight practice. Full MySQL server labs may exceed the browser VM budget.

## Goals

- Explain tables, rows, columns, primary keys, and foreign keys.
- Read basic `SELECT`, `INSERT`, `UPDATE`, and `DELETE` statements.
- Understand why indexes speed reads but add write cost.

## Lightweight Practice

If `sqlite3` is available, run:

```bash
sqlite3 /tmp/lab.db 'create table notes(id integer primary key, body text);'
sqlite3 /tmp/lab.db "insert into notes(body) values ('first note');"
sqlite3 /tmp/lab.db 'select * from notes;'
```

If `sqlite3` is not installed, treat the commands as SQL reading practice and continue to the quiz.

## VM Notes

- MySQL-specific administration is marked separately as concept-only unless a small validated DB image is available.
- Avoid large database datasets in the browser VM.
