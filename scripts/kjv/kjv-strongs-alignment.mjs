/**
 * Shared KJV ↔ CrossWire Strong's token alignment utilities.
 */

export const BOOK_CODE_TO_NAME = {
  Gen: 'Genesis',
  Exod: 'Exodus',
  Lev: 'Leviticus',
  Num: 'Numbers',
  Deut: 'Deuteronomy',
  Josh: 'Joshua',
  Judg: 'Judges',
  Ruth: 'Ruth',
  '1Sam': '1 Samuel',
  '2Sam': '2 Samuel',
  '1Kgs': '1 Kings',
  '2Kgs': '2 Kings',
  '1Chr': '1 Chronicles',
  '2Chr': '2 Chronicles',
  Ezra: 'Ezra',
  Neh: 'Nehemiah',
  Esth: 'Esther',
  Job: 'Job',
  Ps: 'Psalms',
  Prov: 'Proverbs',
  Eccl: 'Ecclesiastes',
  Song: 'Song of Solomon',
  Isa: 'Isaiah',
  Jer: 'Jeremiah',
  Lam: 'Lamentations',
  Ezek: 'Ezekiel',
  Dan: 'Daniel',
  Hos: 'Hosea',
  Joel: 'Joel',
  Amos: 'Amos',
  Obad: 'Obadiah',
  Jonah: 'Jonah',
  Mic: 'Micah',
  Nah: 'Nahum',
  Hab: 'Habakkuk',
  Zeph: 'Zephaniah',
  Hag: 'Haggai',
  Zech: 'Zechariah',
  Mal: 'Malachi',
  Matt: 'Matthew',
  Mark: 'Mark',
  Luke: 'Luke',
  John: 'John',
  Acts: 'Acts',
  Rom: 'Romans',
  '1Cor': '1 Corinthians',
  '2Cor': '2 Corinthians',
  Gal: 'Galatians',
  Eph: 'Ephesians',
  Phil: 'Philippians',
  Col: 'Colossians',
  '1Thess': '1 Thessalonians',
  '2Thess': '2 Thessalonians',
  '1Tim': '1 Timothy',
  '2Tim': '2 Timothy',
  Titus: 'Titus',
  Phlm: 'Philemon',
  Heb: 'Hebrews',
  Jas: 'James',
  '1Pet': '1 Peter',
  '2Pet': '2 Peter',
  '1John': '1 John',
  '2John': '2 John',
  '3John': '3 John',
  Jude: 'Jude',
  Rev: 'Revelation',
};

export const NAME_TO_BOOK_CODE = Object.fromEntries(
  Object.entries(BOOK_CODE_TO_NAME).map(([code, name]) => [name, code]),
);

const ARTICLE_STRONGS = new Set(['G3588', 'H853']);

const STRONGS_NUMBER_PATTERN = /^([HG])\s*0*(\d+)$/i;
const STRONGS_EMBEDDED_PATTERN = /(?:^|\b)(?:strong:)?([HG])\s*0*(\d+)\b/i;

export function verseKey(book, chapter, verse) {
  return `${book}:${chapter}:${verse}`;
}

export function normalizeStrongsNumber(raw) {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  const direct = trimmed.match(STRONGS_NUMBER_PATTERN);
  if (direct) {
    return `${direct[1].toUpperCase()}${direct[2]}`;
  }
  const embedded = trimmed.match(STRONGS_EMBEDDED_PATTERN);
  if (embedded) {
    return `${embedded[1].toUpperCase()}${embedded[2]}`;
  }
  return null;
}

export function pickPrimaryStrongs(strongsList) {
  if (!Array.isArray(strongsList) || strongsList.length === 0) return null;
  const normalized = strongsList
    .map((value) => normalizeStrongsNumber(value))
    .filter(Boolean);
  if (normalized.length === 0) return null;
  const content = normalized.filter((value) => !ARTICLE_STRONGS.has(value));
  return content.length > 0 ? content[content.length - 1] : normalized[0];
}

export function extractStrongsFromCrosswireWord(word) {
  const fromList = pickPrimaryStrongs(word.strongs);
  if (fromList) return fromList;
  if (word.lemma) {
    return normalizeStrongsNumber(word.lemma);
  }
  if (word.source?.lemma) {
    return normalizeStrongsNumber(word.source.lemma);
  }
  return null;
}

/** Truncate embedded cross-reference marginal notes. */
export function truncateAtEmbeddedXref(text) {
  const match = text.match(/\s+\+\s+\d+(?:\.\d+)?/);
  if (match && match.index !== undefined) {
    return text.slice(0, match.index);
  }
  return text;
}

/** Strip KJV editorial markup for alignment and plain display tokens. */
export function stripKjvMarkup(text) {
  return truncateAtEmbeddedXref(text)
    .replace(/\\?\+add\s*([\s\S]*?)\\?\+add\*/g, '$1')
    .replace(/\\?\+nd\s*([\s\S]*?)\\?\+nd\*/g, '$1')
    .replace(/\b(LORD|GOD|JEHOVAH)([\u2019']s)?\*/g, '$1$2');
}

export function prepareKjvVerseDisplayText(text) {
  return stripKjvMarkup(text);
}

export function splitKjvWords(text) {
  return text.match(/[^\s]+/g) ?? [];
}

/** Normalize a word token for sequence alignment (not for display). */
export function normalizeAlignToken(text) {
  return text
    .normalize('NFKC')
    .replace(/\u00e6/g, 'ae')
    .replace(/\u0153/g, 'oe')
    .replace(/[\u2013\u2014\u2212]/g, '-')
    .replace(/\b(LORD|GOD|JEHOVAH)([\u2019']s)?\*/gi, '$1$2')
    .replace(/^[^A-Za-z0-9\u2019']+|[^A-Za-z0-9\u2019']+$/g, '')
    .toLowerCase()
    .replace(/-/g, '');
}

function levenshtein(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[a.length][b.length];
}

export function alignTokensMatch(left, right) {
  if (!left || !right) return false;
  if (left === right) return true;
  const maxLen = Math.max(left.length, right.length);
  if (maxLen < 4) return false;
  return levenshtein(left, right) <= 1;
}

/** Split CrossWire tokens that contain internal whitespace into separate alignable words. */
export function expandCrosswireWords(crossWords) {
  const expanded = [];
  for (const word of crossWords) {
    const segments = splitKjvWords(word.text);
    if (segments.length <= 1) {
      expanded.push(word);
      continue;
    }
    for (const segment of segments) {
      expanded.push({
        ...word,
        text: segment,
      });
    }
  }
  return expanded;
}

/**
 * Align CrossWire word tokens to local KJV display words via LCS.
 * Returns KJV-surface tokens with Strong's numbers from CrossWire.
 */
export function alignCrosswireToKjv(crossWords, kjvDisplayText) {
  const expandedCrossWords = expandCrosswireWords(crossWords);
  const kjvWords = splitKjvWords(kjvDisplayText);
  const kNorm = kjvWords.map(normalizeAlignToken);
  const cNorm = expandedCrossWords.map((word) => normalizeAlignToken(word.text));

  const m = kjvWords.length;
  const n = expandedCrossWords.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (alignTokensMatch(kNorm[i - 1], cNorm[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const tokens = kjvWords.map((text) => ({ text, strongs: null }));
  const pairs = [];
  let i = m;
  let j = n;

  while (i > 0 && j > 0) {
    if (alignTokensMatch(kNorm[i - 1], cNorm[j - 1])) {
      pairs.push({ ki: i - 1, cj: j - 1 });
      i -= 1;
      j -= 1;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i -= 1;
    } else {
      j -= 1;
    }
  }

  for (const { ki, cj } of pairs) {
    tokens[ki].strongs = extractStrongsFromCrosswireWord(expandedCrossWords[cj]);
  }

  const alignedCount = pairs.length;
  const alignmentRatio = m > 0 ? alignedCount / m : 0;

  return {
    tokens,
    alignedCount,
    kjvWordCount: m,
    crossWordCount: n,
    alignmentRatio,
  };
}

export const MIN_ALIGNMENT_RATIO = 0.85;

export function isAlignmentAcceptable(result) {
  return (
    result.kjvWordCount > 0 &&
    result.crossWordCount > 0 &&
    result.alignmentRatio >= MIN_ALIGNMENT_RATIO
  );
}
