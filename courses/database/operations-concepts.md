---
id: database-operations-concepts
course_id: database
title: Operations and Replication Concepts
duration_minutes: 20
vm_compatible: theory-only
source:
  - content/2024-04-01-db101en-section2.markdown
  - content/2024-04-01-db101en-section3.markdown
---

# Operations and Replication Concepts

This lesson is theory-only for the first browser VM milestone.

## Goals

- Distinguish logical backups from physical backups.
- Explain why replication improves availability and read scaling but is not a backup.
- Recognize common replication modes: asynchronous, semi-synchronous, and read replicas.
- Compare relational and NoSQL stores at a high level.

## Discussion Prompts

- What data would be lost if a bad `DELETE` statement replicates successfully?
- Why do backups need restore testing?
- When is eventual consistency acceptable?

## VM Notes

- Full MySQL replication requires multiple database instances and more memory than this milestone should assume.
- Keep operational exercises to command review, diagrams, and short quizzes.
