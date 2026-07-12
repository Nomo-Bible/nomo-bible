import { useReader } from '@/context/ReaderContext';
import {
  formatPassageDocumentTitle,
  useDocumentTitle,
} from '@/hooks/useDocumentTitle';
import { formatReaderLocation } from '@/types/bible';

export function ReaderDocumentTitle() {
  const { location } = useReader();
  const passageLabel = formatReaderLocation(location);
  useDocumentTitle(formatPassageDocumentTitle(passageLabel));
  return null;
}
