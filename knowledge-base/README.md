# Nomomartyria Knowledge Base

This directory is the **single canonical repository** for all biblical knowledge content in the Nomomartyria Bible Platform.

It exists independently of the web application in `app/`. Software may change; the Knowledge Base endures.

---

## Purpose

The Knowledge Base preserves, organizes, and delivers biblical knowledge as permanent content — separate from application code, UI, and deployment infrastructure.

Every study note, cross reference, doctrine article, chart, timeline, and educational resource ultimately connects back to Scripture stored here. The inspired text and canonical supplemental material live in this repository, not inside the application layer.

See `docs/03-Knowledge-Base.md` for the governing principles.

---

## Why it exists outside the application

The platform architecture treats knowledge and software as distinct layers:

```
Knowledge Base (this directory)
        ↓
   Service Layer (app/src/services/)
        ↓
Presentation Layer (app/src/components/, app/src/pages/)
```

- **Software is the delivery system.** It reads from the Knowledge Base and presents it to users.
- **Knowledge is the product.** It must survive technology changes, refactors, and new applications.
- **Scripture remains central.** Bible text is stored here first; the app imports processed artifacts at build time.

No application module owns biblical knowledge. All official content is authored, versioned, and stored here.

---

## Directory philosophy

Content is organized by **domain and format**, not by application feature:

```
knowledge-base/
├── bible/          # Inspired Scripture and translation artifacts
│   └── kjv/
│       ├── source/     # Raw public-domain source files
│       └── processed/  # Normalized JSON consumed by the app
└── (future)        # Study notes, cross references, doctrine, etc.
```

Guiding rules:

1. **Raw sources stay raw.** Downloaded or imported source files live under `source/`.
2. **Processed artifacts are derived.** Normalized, app-ready files live under `processed/`.
3. **One canonical copy.** Official knowledge exists once in this tree; applications read from it.
4. **Content grows by phase.** New categories (study notes, cross references, topics) will be added here as the roadmap progresses.

---

## Relationship to the application

The React application in `app/` consumes Knowledge Base artifacts but does not store canonical content:

| Knowledge Base path | Application usage |
|---------------------|-------------------|
| `bible/kjv/processed/kjv-verses.json` | Imported at build time via `@knowledge-base` alias |
| `bible/kjv/source/` | Used by `scripts/kjv/` import tooling only |

The app resolves `@knowledge-base` to this directory through `app/vite.config.ts` and `app/tsconfig.json`. Netlify builds require both `app/` and `knowledge-base/` to be present in the repository.

Study notes and cross references remain application placeholders until their canonical content is added here in a future phase.

---

## Relationship to constitutional documents

The Knowledge Base implements the architecture defined in the project constitution:

| Document | Relevance |
|----------|-----------|
| `docs/03-Knowledge-Base.md` | Mission, Knowledge Objects, categories, single source of truth |
| `docs/04-Bible-Data.md` | Bible text representation, verse identity, separation of Scripture from supplemental material |
| `docs/05-Architecture.md` | Knowledge Layer vs. Service Layer vs. Presentation Layer |
| `docs/06-Database.md` | Future path for importing Knowledge Base content into Netlify Database |

These documents are not modified by Knowledge Base maintenance. This directory follows their principles.

---

## Current contents

| Path | Description |
|------|-------------|
| `bible/kjv/source/eng-kjv2006_usfm.zip` | Public-domain KJV USFM archive from [eBible.org](https://ebible.org/find/show.php?id=eng-kjv2006) |
| `bible/kjv/processed/kjv-verses.json` | Normalized KJV verse corpus (31,102 verses, 66 books) |

Regenerate processed Bible JSON from the repository root:

```bash
npm run kjv:convert
```

See the root `README.md` for full import and deployment instructions.

---

## Long-term vision

This directory will grow to include study notes, cross references, doctrine articles, topics, charts, timelines, maps, courses, and other Knowledge Objects — all connected to Scripture through a relationship-centered model.

Content will be added in future phases. The structure established here is the permanent foundation.
