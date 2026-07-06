import { Fragment, type ReactNode } from 'react';
import {
  buildArticleHeadingIdMap,
  slugifyArticleHeading,
} from '@/utils/articleSlug';

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else {
      nodes.push(<em key={key++}>{token.slice(1, -1)}</em>);
    }
    last = pattern.lastIndex;
  }

  if (last < text.length) {
    nodes.push(text.slice(last));
  }

  return nodes.length > 0 ? nodes : [text];
}

function headingIdForText(text: string, headingIds: Map<string, string>): string {
  return headingIds.get(text) ?? slugifyArticleHeading(text);
}

function renderHeading(
  level: 1 | 2 | 3 | 4 | 5,
  text: string,
  headingIds: Map<string, string>,
  key: number,
): ReactNode {
  const id = headingIdForText(text, headingIds);
  const className =
    level === 1
      ? 'study-article__h1'
      : level === 2
        ? 'study-article__h2'
        : level === 3
          ? 'study-article__h3'
          : level === 4 || level === 5
            ? 'study-article__h4'
            : 'study-article__h4';
  const Tag = `h${Math.min(level, 4)}` as 'h1' | 'h2' | 'h3' | 'h4';

  return (
    <Tag key={key} id={id} className={className}>
      {text}
    </Tag>
  );
}

export function renderArticleMarkdown(markdown: string): ReactNode[] {
  const headingIds = buildArticleHeadingIdMap(markdown);
  const lines = markdown.split('\n');
  const nodes: ReactNode[] = [];
  let key = 0;
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let skipTableOfContents = false;

  const parseTableRow = (row: string): string[] =>
    row
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((cell) => cell.trim());

  const isTableSeparator = (row: string): boolean =>
    /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(row.trim());

  const renderTable = (tableLines: string[], tableKey: number): ReactNode => {
    const rows = tableLines.map(parseTableRow);
    const header = rows[0] ?? [];
    const bodyRows = rows.slice(1);

    return (
      <div key={tableKey} className="study-article__table-wrap">
        <table className="study-article__table">
          <thead>
            <tr>
              {header.map((cell) => (
                <th key={cell}>{renderInline(cell)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={`${rowIndex}-${cellIndex}`}>{renderInline(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(' ').trim();
    if (text) {
      nodes.push(<p key={key++}>{renderInline(text)}</p>);
    }
    paragraph = [];
  };

  const flushList = () => {
    if (listItems.length === 0) return;
    nodes.push(
      <ul key={key++}>
        {listItems.map((item) => (
          <li key={item}>{renderInline(item)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const rawLine = lines[lineIndex];
    const line = rawLine.trimEnd();

    if (line.trim().startsWith('```')) {
      flushParagraph();
      flushList();
      const codeLines: string[] = [];
      lineIndex += 1;
      while (lineIndex < lines.length && !lines[lineIndex].trim().startsWith('```')) {
        codeLines.push(lines[lineIndex]);
        lineIndex += 1;
      }
      nodes.push(
        <pre key={key++} className="study-article__pre">
          <code>{codeLines.join('\n')}</code>
        </pre>,
      );
      continue;
    }

    if (line.trim().startsWith('|')) {
      flushParagraph();
      flushList();
      const tableLines: string[] = [];
      while (lineIndex < lines.length && lines[lineIndex].trim().startsWith('|')) {
        const tableLine = lines[lineIndex].trim();
        if (!isTableSeparator(tableLine)) {
          tableLines.push(tableLine);
        } else if (tableLines.length > 0) {
          tableLines.push(tableLine);
        }
        lineIndex += 1;
      }
      lineIndex -= 1;
      if (tableLines.length >= 2) {
        const dataLines = tableLines.filter((row) => !isTableSeparator(row));
        nodes.push(renderTable(dataLines, key++));
      }
      continue;
    }

    if (!line.trim()) {
      if (!skipTableOfContents) {
        flushParagraph();
        flushList();
      }
      continue;
    }

    if (line.startsWith('## TABLE OF CONTENTS')) {
      flushParagraph();
      flushList();
      skipTableOfContents = true;
      continue;
    }

    if (skipTableOfContents) {
      if (line.startsWith('## ') && !line.startsWith('## TABLE OF CONTENTS')) {
        skipTableOfContents = false;
      } else {
        continue;
      }
    }

    if (line.startsWith('# ')) {
      flushParagraph();
      flushList();
      nodes.push(renderHeading(1, line.slice(2), headingIds, key++));
      continue;
    }
    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      nodes.push(renderHeading(2, line.slice(3), headingIds, key++));
      continue;
    }
    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      nodes.push(renderHeading(3, line.slice(4), headingIds, key++));
      continue;
    }
    if (line.startsWith('#### ')) {
      flushParagraph();
      flushList();
      nodes.push(renderHeading(4, line.slice(5), headingIds, key++));
      continue;
    }
    if (line.startsWith('##### ')) {
      flushParagraph();
      flushList();
      nodes.push(renderHeading(5, line.slice(6), headingIds, key++));
      continue;
    }
    if (line.startsWith('> ')) {
      flushParagraph();
      flushList();
      nodes.push(
        <blockquote key={key++} className="study-article__quote">
          {renderInline(line.slice(2))}
        </blockquote>,
      );
      continue;
    }
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      flushParagraph();
      flushList();
      const [, alt, src] = imageMatch;
      nodes.push(
        <figure key={key++} className="study-article__figure">
          <img src={src} alt={alt} className="study-article__image" loading="lazy" />
          {alt ? (
            <figcaption className="study-article__caption">{alt}</figcaption>
          ) : null}
        </figure>,
      );
      continue;
    }
    if (line.startsWith('- ')) {
      flushParagraph();
      listItems.push(line.slice(2));
      continue;
    }
    if (/^\d+\. /.test(line)) {
      flushParagraph();
      flushList();
      nodes.push(
        <p key={key++} className="study-article__numbered">
          {renderInline(line)}
        </p>,
      );
      continue;
    }

    flushList();
    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();

  return nodes.length > 0 ? nodes : [<Fragment key="empty" />];
}
