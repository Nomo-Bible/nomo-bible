# Nomomartyria Bible Platform

A Christ-centered Bible study platform built around the public-domain King James Version (KJV).

## Bible text source

The reader and search features use the **King James Version (1769 standardized text)** from [eBible.org](https://ebible.org/find/show.php?id=eng-kjv2006) (`eng-kjv2006`).

- **Public domain** outside the United Kingdom. eBible.org distributes this text freely via Crosswire Bible Society.
- UK Crown copyright on the KJV does not apply in most other jurisdictions. See [eBible.org](https://ebible.org/find/show.php?id=eng-kjv2006) and [Wikipedia: KJV copyright status](https://en.wikipedia.org/wiki/King_James_Version#Copyright_status) for details.
- This project does **not** use BibleGateway, YouVersion, NIV, ESV, NKJV, or other copyrighted Bible APIs.
- Bible text is stored **locally** in this repository and loaded at build time — no live Bible API is used at runtime.

## Bible data layout

| Path | Purpose |
|------|---------|
| `knowledge-base/bible/kjv/source/eng-kjv2006_usfm.zip` | Raw eBible USFM archive (downloaded source) |
| `knowledge-base/bible/kjv/source/eng-kjv2006_usfm/` | Extracted USFM files (generated; not required in git) |
| `knowledge-base/bible/kjv/processed/kjv-verses.json` | Normalized verse JSON consumed by the web app |

Each verse object in `kjv-verses.json` includes:

- `translation` — `"KJV"`
- `testament` — `"Old Testament"` or `"New Testament"`
- `book`, `bookOrder`, `chapter`, `verse`, `text`, `reference`

## Regenerating the processed JSON

From the repository root:

```bash
# Download the USFM archive from eBible.org
npm run kjv:download

# Convert USFM → kjv-verses.json (extracts the zip if needed)
npm run kjv:convert

# Or run both steps
npm run kjv:import
```

Scripts live in `scripts/kjv/`:

- `download-kjv.mjs` — fetches `eng-kjv2006_usfm.zip`
- `convert-usfm-to-json.mjs` — parses USFM, strips markup, writes normalized JSON

After regenerating, rebuild the app (`cd app && npm run build`).

## Running the app

```bash
cd app
npm install
npm run dev
```

Open the Bible reader and use book/chapter/verse navigation or the global KJV search bar.

## Netlify deployment

Netlify reads `netlify.toml` at the repository root:

| Setting | Value |
|---------|-------|
| Base directory | `app` |
| Build command | `npm ci && npm run build` |
| Publish directory | `app/dist` (relative to repo root) |
| Node version | 20 |

The build imports KJV data from `knowledge-base/bible/kjv/processed/kjv-verses.json`, so **both `app/` and `knowledge-base/` must be committed and pushed** before deploying.

If Netlify reports *"Base directory does not exist"*, the site is missing those directories in git, or the Netlify UI has a conflicting base directory override. Clear any manual base-directory override under **Site configuration → Build & deploy → Build settings** and let `netlify.toml` control the build.

## Testing Bible navigation

1. Start the dev server (`npm run dev` in `app/`).
2. Open the Bible reader page.
3. Confirm all **66 books** appear in the Book dropdown (Genesis through Revelation).
4. Select books with many chapters (e.g. Psalms, Isaiah) and verify chapter lists load.
5. Select a chapter and confirm full verse text appears (e.g. Genesis 1, John 3, Revelation 22).
6. Use **Previous Chapter** / **Next Chapter** across book boundaries (e.g. Malachi 4 → Matthew 1).
7. Choose a single verse from the Verse dropdown and confirm it scrolls into view.

## Testing Bible search

1. Use the global **Search KJV** bar in the header.
2. Search for a common word (e.g. `love`, `faith`, `light`) and confirm real KJV passages appear.
3. Search for a reference fragment (e.g. `John 3:16`) and confirm matching verses.
4. Verify the result count reflects the full corpus (results panel shows the first 50 matches when there are more).

## Project structure

- `app/` — React + Vite web application
- `knowledge-base/` — Canonical Bible text and future knowledge content
- `docs/` — Project governance and architecture documents
- `scripts/kjv/` — KJV download and conversion tooling

Study notes and cross references remain placeholders until a later phase. Netlify Database integration is planned but not connected yet.
