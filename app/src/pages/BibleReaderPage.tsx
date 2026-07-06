import { ReaderProvider } from '@/context/ReaderContext';
import { PageBanner } from '@/components/ui/PageBanner';
import { ScriptureWorkspace } from '@/components/workspace/ScriptureWorkspace';
import scriptureWorkspaceBanner from '@/assets/banners/scripture-workspace.png';
import './BibleReaderPage.css';

export function BibleReaderPage() {
  return (
    <ReaderProvider>
      <div className="bible-reader-page">
        <PageBanner
          imageSrc={scriptureWorkspaceBanner}
          imageAlt="Scripture Workspace — Per Legem et Testimonium, Christus Revelatur. Nomomartyria Bible Platform."
        />

        <ScriptureWorkspace />
      </div>
    </ReaderProvider>
  );
}
