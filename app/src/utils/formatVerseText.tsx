import { Fragment, type ReactNode } from 'react';
import {
  formatDivineNameDisplay,
  KJV_VERSE_RENDER_PATTERN,
  prepareKjvVerseDisplayText,
} from '@/utils/kjvVerseMarkup';

/** Presentation-only formatting for KJV verse strings (does not alter source data). */
export function formatVerseText(text: string): ReactNode[] {
  const displayText = prepareKjvVerseDisplayText(text);
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  KJV_VERSE_RENDER_PATTERN.lastIndex = 0;

  while ((match = KJV_VERSE_RENDER_PATTERN.exec(displayText)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <Fragment key={`t-${key++}`}>
          {displayText.slice(lastIndex, match.index)}
        </Fragment>,
      );
    }

    if (match[1] !== undefined) {
      nodes.push(
        <em key={`a-${key++}`} className="scripture-reader__supplied">
          {match[1]}
        </em>,
      );
    } else if (match[2] !== undefined) {
      nodes.push(
        <span key={`n-${key++}`} className="scripture-reader__divine-name">
          {match[2].trim()}
        </span>,
      );
    } else if (match[3] !== undefined) {
      nodes.push(
        <span key={`d-${key++}`} className="scripture-reader__divine-name">
          {formatDivineNameDisplay(match[3], match[4] ?? '')}
        </span>,
      );
    }

    lastIndex = KJV_VERSE_RENDER_PATTERN.lastIndex;
  }

  if (lastIndex < displayText.length) {
    nodes.push(
      <Fragment key={`t-${key++}`}>{displayText.slice(lastIndex)}</Fragment>,
    );
  }

  return nodes.length > 0 ? nodes : [displayText];
}
