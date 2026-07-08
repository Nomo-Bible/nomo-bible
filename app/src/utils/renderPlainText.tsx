import { splitEgwParagraphs } from '@/utils/parseEgwPlainText';

export function renderPlainText(content: string) {
  const paragraphs = splitEgwParagraphs(content);

  return paragraphs.map((paragraph, index) => {
    if (/^Chapter\s+\d+/i.test(paragraph)) {
      return (
        <h3 key={index} className="study-article__h3">
          {paragraph}
        </h3>
      );
    }
    return <p key={index}>{paragraph}</p>;
  });
}
