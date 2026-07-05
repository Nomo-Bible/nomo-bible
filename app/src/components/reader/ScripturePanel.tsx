import { useEffect, useRef } from 'react';
import { useReader } from '@/context/ReaderContext';
import { getChapter } from '@/services/bibleService';
import './ScripturePanel.css';

export function ScripturePanel() {
  const { location } = useReader();
  const activeVerseRef = useRef<HTMLParagraphElement>(null);
  const chapter = getChapter(location.book, location.chapter);

  useEffect(() => {
    if (location.verse !== null && activeVerseRef.current) {
      activeVerseRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [location.book, location.chapter, location.verse]);

  if (!chapter) {
    return (
      <article className="scripture-panel" aria-label="Scripture text">
        <header className="scripture-panel__header">
          <h2>{location.book} {location.chapter}</h2>
          <span className="scripture-panel__badge">KJV</span>
        </header>
        <p className="scripture-panel__empty">
          This passage could not be loaded.
        </p>
      </article>
    );
  }

  const heading =
    location.verse !== null
      ? `${chapter.book} ${chapter.chapter}:${location.verse}`
      : `${chapter.book} ${chapter.chapter}`;

  return (
    <article className="scripture-panel" aria-label="Scripture text">
      <header className="scripture-panel__header">
        <h2>{heading}</h2>
        <span className="scripture-panel__badge">KJV</span>
      </header>

      <div className="scripture-panel__text">
        {chapter.verses.map(({ number, text }) => {
          const isActive = location.verse === number;
          return (
            <p
              key={number}
              ref={isActive ? activeVerseRef : undefined}
              className={
                isActive
                  ? 'scripture-panel__verse scripture-panel__verse--active'
                  : 'scripture-panel__verse'
              }
              id={isActive ? 'scripture-active-verse' : undefined}
            >
              <sup className="scripture-panel__verse-num">{number}</sup>
              {text}
            </p>
          );
        })}
      </div>
    </article>
  );
}
