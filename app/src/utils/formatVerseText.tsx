import { Fragment, type MouseEvent, type ReactNode } from 'react';
import type { VerseWordToken } from '@/types/verseTokens';
import {
  formatDivineNameDisplay,
  KJV_VERSE_RENDER_PATTERN,
  prepareKjvVerseDisplayText,
} from '@/utils/kjvVerseMarkup';

export interface RenderVerseOptions {
  onWordClick?: (
    token: VerseWordToken,
    tokenIndex: number,
    event: MouseEvent<HTMLButtonElement>,
  ) => void;
  activeTokenId?: string | null;
  tokenIdPrefix?: string;
  highlightedTokenIndexes?: Set<number>;
}

function renderTokenButton(
  token: VerseWordToken,
  tokenIndex: number,
  options: RenderVerseOptions,
): ReactNode {
  const tokenId = `${options.tokenIdPrefix ?? 'token'}:${tokenIndex}`;
  const isActive = options.activeTokenId === tokenId;
  const isSearchMatch = options.highlightedTokenIndexes?.has(tokenIndex) ?? false;
  const className = [
    'scripture-reader__word',
    isActive ? 'scripture-reader__word--active' : '',
    isSearchMatch ? 'scripture-reader__word--search-match' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      key={tokenId}
      type="button"
      id={tokenId}
      className={className}
      onClick={(event) => options.onWordClick?.(token, tokenIndex, event)}
      aria-label={`Study word: ${token.text}`}
      aria-pressed={isActive}
    >
      {token.text}
    </button>
  );
}

export function renderTaggedVerseTokens(
  tokens: VerseWordToken[],
  options: RenderVerseOptions,
): ReactNode[] {
  const nodes: ReactNode[] = [];

  tokens.forEach((token, index) => {
    if (index > 0) {
      nodes.push(<Fragment key={`space-${index}`}> </Fragment>);
    }
    nodes.push(renderTokenButton(token, index, options));
  });

  return nodes;
}

const CLICKABLE_WORD_PATTERN = /[A-Za-z\u2019'][A-Za-z'\u2019-]*/g;

export function buildDisplayWordTokens(text: string): VerseWordToken[] {
  const displayText = prepareKjvVerseDisplayText(text);
  const tokens: VerseWordToken[] = [];
  let match: RegExpExecArray | null;

  CLICKABLE_WORD_PATTERN.lastIndex = 0;
  while ((match = CLICKABLE_WORD_PATTERN.exec(displayText)) !== null) {
    tokens.push({ text: match[0], strongs: null });
  }

  return tokens;
}

function wrapFallbackWords(
  text: string,
  options: RenderVerseOptions,
  keyPrefix: string,
): ReactNode[] {
  if (!options.onWordClick) {
    return [text];
  }

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let wordIndex = 0;
  let match: RegExpExecArray | null;

  CLICKABLE_WORD_PATTERN.lastIndex = 0;

  while ((match = CLICKABLE_WORD_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <Fragment key={`${keyPrefix}-t-${key++}`}>
          {text.slice(lastIndex, match.index)}
        </Fragment>,
      );
    }

    const token: VerseWordToken = { text: match[0], strongs: null };
    nodes.push(renderTokenButton(token, wordIndex, options));
    wordIndex += 1;
    lastIndex = CLICKABLE_WORD_PATTERN.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(
      <Fragment key={`${keyPrefix}-t-${key++}`}>{text.slice(lastIndex)}</Fragment>,
    );
  }

  return nodes.length > 0 ? nodes : [text];
}

function renderTextSegment(
  text: string,
  options: RenderVerseOptions,
  keyPrefix: string,
): ReactNode {
  if (!options.onWordClick || text.length === 0) {
    return text;
  }
  return wrapFallbackWords(text, options, keyPrefix);
}

/** Fallback renderer for verses without Strong's token tagging. */
export function formatVerseText(
  text: string,
  options?: RenderVerseOptions,
): ReactNode[] {
  const displayText = prepareKjvVerseDisplayText(text);
  const onWordClick = options?.onWordClick;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  KJV_VERSE_RENDER_PATTERN.lastIndex = 0;

  while ((match = KJV_VERSE_RENDER_PATTERN.exec(displayText)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <Fragment key={`t-${key++}`}>
          {renderTextSegment(displayText.slice(lastIndex, match.index), options ?? {}, `seg-${key}`)}
        </Fragment>,
      );
    }

    if (match[1] !== undefined) {
      nodes.push(
        <em key={`a-${key++}`} className="scripture-reader__supplied">
          {renderTextSegment(match[1], options ?? {}, `sup-${key}`)}
        </em>,
      );
    } else if (match[2] !== undefined) {
      nodes.push(
        <span key={`n-${key++}`} className="scripture-reader__divine-name">
          {renderTextSegment(match[2].trim(), options ?? {}, `nd-${key}`)}
        </span>,
      );
    } else if (match[3] !== undefined) {
      const divineText = formatDivineNameDisplay(match[3], match[4] ?? '');
      nodes.push(
        <span key={`d-${key++}`} className="scripture-reader__divine-name">
          {renderTextSegment(divineText, options ?? {}, `dn-${key}`)}
        </span>,
      );
    }

    lastIndex = KJV_VERSE_RENDER_PATTERN.lastIndex;
  }

  if (lastIndex < displayText.length) {
    nodes.push(
      <Fragment key={`t-${key++}`}>
        {renderTextSegment(displayText.slice(lastIndex), options ?? {}, `end-${key}`)}
      </Fragment>,
    );
  }

  if (nodes.length === 0) {
    return onWordClick
      ? wrapFallbackWords(displayText, options ?? {}, 'full')
      : [displayText];
  }

  return nodes;
}

export function renderVerseContent(
  text: string,
  tokens: VerseWordToken[] | null,
  options?: RenderVerseOptions,
): ReactNode[] {
  if (tokens && tokens.length > 0) {
    return renderTaggedVerseTokens(tokens, options ?? {});
  }
  return formatVerseText(text, options);
}
