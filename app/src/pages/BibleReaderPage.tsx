import { ReaderProvider } from '@/context/ReaderContext';
import { ScriptureWorkspace } from '@/components/workspace/ScriptureWorkspace';
import './BibleReaderPage.css';

export function BibleReaderPage() {
  return (
    <ReaderProvider>
      <div className="bible-reader-page">
        <header className="bible-reader-page__header">
          <h1>Scripture Workspace</h1>
          <p className="bible-reader-page__subtitle">
            King James Version · Read, navigate, and study
          </p>
        </header>

        <ScriptureWorkspace />
      </div>
    </ReaderProvider>
  );
}
