import { ReaderProvider } from '@/context/ReaderContext';

import { ScripturePanel } from '@/components/reader/ScripturePanel';

import { StudyNotesPanel } from '@/components/reader/StudyNotesPanel';

import { CrossReferencesPanel } from '@/components/reader/CrossReferencesPanel';

import { ReaderNavigation } from '@/components/reader/ReaderNavigation';

import './BibleReaderPage.css';



export function BibleReaderPage() {

  return (

    <ReaderProvider>

      <div className="bible-reader">

        <header className="bible-reader__header">

          <h1>Bible Reader</h1>

          <p className="bible-reader__subtitle">

            King James Version · Sample passages

          </p>

        </header>



        <ReaderNavigation />



        <div className="bible-reader__content">

          <ScripturePanel />

          <aside className="bible-reader__sidebar">

            <StudyNotesPanel />

            <CrossReferencesPanel />

          </aside>

        </div>

      </div>

    </ReaderProvider>

  );

}

