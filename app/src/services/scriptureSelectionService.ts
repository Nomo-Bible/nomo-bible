import { stripKjvEditorialMarkup } from '@/utils/kjvVerseMarkup';

export function formatVersesForClipboard(
  book: string,
  chapter: number,
  verseNumbers: number[],
  getVerseText: (verse: number) => string | undefined,
): string {
  return [...verseNumbers]
    .sort((a, b) => a - b)
    .map((verse) => {
      const reference = `${book} ${chapter}:${verse}`;
      const raw = getVerseText(verse) ?? '';
      const text = stripKjvEditorialMarkup(raw);
      return `${reference}\n${text}`;
    })
    .join('\n\n');
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
