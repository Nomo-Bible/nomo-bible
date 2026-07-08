import DOMPurify from 'dompurify';

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

const NOTE_ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  'mark',
  'ul',
  'ol',
  'li',
  'blockquote',
  'a',
  'span',
  'div',
];

const NOTE_ALLOWED_ATTR = ['href', 'target', 'rel', 'data-color', 'class'];

export function isNoteHtml(body: string): boolean {
  return HTML_TAG_PATTERN.test(body);
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function plainTextToNoteHtml(body: string): string {
  const trimmed = body.trim();
  if (!trimmed) return '';
  if (isNoteHtml(trimmed)) return sanitizeNoteHtml(trimmed);

  return trimmed
    .split(/\n{2,}/)
    .map((paragraph) => {
      const lines = paragraph.split('\n');
      const htmlLines = lines.map((line) => escapeHtml(line)).join('<br>');
      return `<p>${htmlLines}</p>`;
    })
    .join('');
}

export function sanitizeNoteHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: NOTE_ALLOWED_TAGS,
    ALLOWED_ATTR: NOTE_ALLOWED_ATTR,
    ALLOW_DATA_ATTR: true,
  });
}

export function stripNoteHtml(html: string): string {
  if (!html) return '';
  if (!isNoteHtml(html)) return html;

  const sanitized = sanitizeNoteHtml(html);
  const doc = new DOMParser().parseFromString(sanitized, 'text/html');
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}

export function formatScripturePlainToNoteHtml(text: string): string {
  const blocks = text.trim().split(/\n{2,}/);
  return blocks
    .map((block) => {
      const lines = block.split('\n');
      const reference = lines[0]?.trim() ?? '';
      const verseText = lines.slice(1).join('\n').trim();
      const refHtml = reference ? `<strong>${escapeHtml(reference)}</strong>` : '';
      const bodyHtml = verseText
        ? `<br>${escapeHtml(verseText).replace(/\n/g, '<br>')}`
        : '';
      return `<p>${refHtml}${bodyHtml}</p>`;
    })
    .join('');
}

export function noteBodyToEditorHtml(body: string): string {
  if (!body.trim()) return '';
  if (isNoteHtml(body)) return sanitizeNoteHtml(body);
  return plainTextToNoteHtml(body);
}
