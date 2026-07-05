# Database

## Purpose

This document defines the data architecture of the Nomomartyria Bible Platform.

The database exists to store, organize, retrieve, and preserve the information contained within the Nomomartyria Knowledge Base.

The database is an implementation of the Knowledge Base.

It is not the Knowledge Base itself.

Knowledge remains the authoritative source.

The database provides efficient access to that knowledge.

---

# Design Philosophy

The database shall be designed according to the following principles:

- Knowledge First
- Scripture Centered
- Relationship Driven
- Normalized
- Extensible
- Maintainable
- Portable

The structure shall support decades of growth without requiring fundamental redesign.

---

# Database Platform

Version 1 of the Nomomartyria Bible Platform shall use:

Netlify Database (PostgreSQL)

The platform architecture shall remain database-independent wherever practical so that future migration to another PostgreSQL-compatible provider can be accomplished with minimal disruption.

No application logic shall become permanently dependent upon a specific database vendor.

---

# Source of Truth

The database stores the canonical Knowledge Base.

Every application retrieves its information from this database.

No application shall maintain independent copies of official theological content.

There shall be one canonical repository.

Many presentation layers.

---

# Primary Knowledge Objects

The database shall support the following primary knowledge objects.

## Biblical Text

- Testament
- Book
- Chapter
- Verse
- Translation
- Verse Text

---

## Study Notes

- Verse association
- Study note content
- Author
- Revision history

---

## Cross References

- Source verse
- Target verse
- Relationship type
- Notes

---

## Doctrines

- Title
- Summary
- Full article
- Supporting Scripture
- Related doctrines

---

## Topics

- Name
- Description
- Related verses
- Related doctrines

---

## Word Studies

- Original word
- Transliteration
- Definition
- Strong's number
- Related verses

---

## Characters

- Name
- Biography
- Related passages
- Family relationships

---

## Places

- Name
- Geographic information
- Historical significance
- Related passages

---

## Events

- Name
- Description
- Historical context
- Timeline position
- Related passages

---

## Prophecy Studies

- Topic
- Timeline
- Related passages
- Historical fulfillment

---

## Sanctuary Studies

- Topic
- Related passages
- Typology
- Christological significance

---

## Articles

- Title
- Author
- Category
- Body
- References

---

## Charts

- Title
- Description
- Image
- Related knowledge objects

---

## Timelines

- Event
- Date
- Description
- Related passages

---

## Courses

- Lessons
- Reading assignments
- Quizzes
- Exams
- Progress tracking

---

## Media

- Images
- Audio
- Video
- Downloads

---

# User Data

User information shall remain completely separate from Canonical Content.

Examples include:

- Accounts
- Profiles
- Notes
- Highlights
- Bookmarks
- Reading plans
- Collections
- Study journals
- Progress tracking

User content shall never alter Canonical Content.

---

# Relationships

The database is designed around relationships rather than isolated records.

Examples include:

Verse ↔ Study Notes

Verse ↔ Cross References

Verse ↔ Doctrine

Doctrine ↔ Topics

Doctrine ↔ Articles

Articles ↔ Charts

Charts ↔ Timelines

Timelines ↔ Events

Events ↔ Places

Characters ↔ Events

Courses ↔ Lessons

Lessons ↔ Scripture

Every major Knowledge Object should be capable of relating to other Knowledge Objects.

---

# Search

The database shall support searching by:

- Scripture reference
- Word
- Phrase
- Topic
- Doctrine
- Character
- Place
- Event
- Strong's number
- Original language
- Author
- Article title

Future search capabilities may include semantic and AI-assisted search while preserving Scripture as the primary authority.

---

# Versioning

Canonical Content shall support revision history.

Changes to official content should be traceable.

Historical versions should be recoverable when appropriate.

---

# Security

The database shall protect:

Canonical Content

User Data

Administrative Functions

Access permissions shall be role-based.

Administrative privileges shall be granted only to authorized editors.

---

# Performance

The database should be optimized for:

Fast Scripture lookup

Cross-reference navigation

Topic exploration

Relationship discovery

Full-text search

Scalability

Read operations shall receive priority since the majority of platform activity consists of biblical study rather than content editing.

---

# Future Expansion

The database architecture shall support future additions including:

Additional Bible translations

Multiple languages

Public APIs

Church resources

Educational institutions

Printed publications

Research tools

AI-assisted discovery

Collaborative study features

Future expansion shall preserve compatibility with the constitutional documents of the Nomomartyria Bible Platform.

---

# Closing Statement

The database exists to faithfully preserve and deliver the biblical knowledge entrusted to the Nomomartyria Bible Platform.

It is the storage engine of the platform.

The Knowledge Base remains the source of truth.

The software provides access.

Scripture remains the foundation.

Christ remains the center.