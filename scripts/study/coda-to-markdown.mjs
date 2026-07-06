/**
 * Shared helpers: convert Coda CDP innerText export to markdown.
 */

export function cleanCodaText(raw) {
  let text = raw;
  const cut = text.indexOf('\n\nGet started with a free account');
  if (cut > 0) text = text.slice(0, cut);
  text = text.replace(/^Skip to content\n/, '').replace(/⁠/g, '');
  return text;
}

export function linesToMarkdownBody(lines, config) {
  const {
    skipTitles = [],
    sectionHeadings = [],
    subsectionTitles = [],
    subheadingPattern = /^[A-Z][a-z].+ — /,
  } = config;

  const skip = new Set(skipTitles);
  const sections = new Set(sectionHeadings);
  const subsections = new Set(subsectionTitles);
  const body = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line || skip.has(line)) continue;

    if (line.match(/^PART [IVX]+:/)) {
      body.push(`## ${line}`);
      continue;
    }
    if (line.match(/^CHAPTER \d+$/)) {
      const title = lines[i + 1] ?? '';
      body.push(`## Chapter ${line.replace('CHAPTER ', '')}: ${title}`);
      i += 1;
      continue;
    }
    if (sections.has(line)) {
      body.push(`## ${line}`);
      continue;
    }
    if (subsections.has(line)) {
      body.push(`### ${line}`);
      continue;
    }
    if (subheadingPattern.test(line) && line.length < 100) {
      body.push(`### ${line}`);
      continue;
    }
    if (line.startsWith('\u201c') || line.startsWith('"')) {
      body.push(`> ${line}`);
      continue;
    }
    if (line.match(/^\d+\. /)) {
      body.push(line);
      continue;
    }
    if (line.startsWith('- ')) {
      body.push(line);
      continue;
    }
    if (line.match(/^[🌎🌾👑🏛📖🕊️⚖️📜]/)) {
      body.push(`#### ${line}`);
      continue;
    }
    body.push(line);
  }

  return body.join('\n\n');
}

export function parseCdpExport(cdpJson) {
  const parsed = JSON.parse(cdpJson);
  const value = parsed?.result?.value;
  if (typeof value === 'string') {
    return { text: value, images: [] };
  }
  if (value && typeof value === 'object') {
    return {
      text: value.text ?? '',
      images: Array.isArray(value.images) ? value.images : [],
    };
  }
  throw new Error('Unexpected CDP export format');
}
