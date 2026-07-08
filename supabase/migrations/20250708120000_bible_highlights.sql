-- Bible verse highlights for signed-in users
CREATE TABLE IF NOT EXISTS bible_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  color TEXT NOT NULL DEFAULT 'yellow',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, book, chapter, verse)
);

CREATE INDEX IF NOT EXISTS bible_highlights_user_chapter_idx
  ON bible_highlights (user_id, book, chapter);

ALTER TABLE bible_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own highlights"
  ON bible_highlights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own highlights"
  ON bible_highlights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own highlights"
  ON bible_highlights FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own highlights"
  ON bible_highlights FOR DELETE
  USING (auth.uid() = user_id);
