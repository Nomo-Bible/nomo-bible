import {
  BookMarked,
  Copy,
  Highlighter,
  NotebookPen,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/auth/useAuth';
import { useScriptureInteraction } from '@/context/ScriptureInteractionContext';
import { HIGHLIGHT_COLORS, type HighlightColor } from '@/types/scriptureInteraction';
import './VerseSelectionToolbar.css';

interface VerseSelectionToolbarProps {
  variant?: 'desktop' | 'mobile';
}

export function VerseSelectionToolbar({
  variant = 'desktop',
}: VerseSelectionToolbarProps) {
  const { isAuthenticated } = useAuth();
  const {
    hasSelection,
    selectionCount,
    highlightColor,
    setHighlightColor,
    copySelectedVerses,
    addSelectedToStudyNote,
    highlightSelectedVerses,
    removeHighlightFromSelected,
    clearSelection,
  } = useScriptureInteraction();
  const [showColors, setShowColors] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!hasSelection) return null;

  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 2000);
  };

  const handleCopy = async () => {
    const ok = await copySelectedVerses();
    showFeedback(ok ? 'Copied' : 'Copy failed');
  };

  const handleHighlight = async (color: HighlightColor) => {
    await highlightSelectedVerses(color);
    setShowColors(false);
    showFeedback('Highlighted');
  };

  const handleRemoveHighlight = async () => {
    await removeHighlightFromSelected();
    showFeedback('Highlight removed');
  };

  const className =
    variant === 'mobile'
      ? 'verse-selection-toolbar verse-selection-toolbar--mobile'
      : 'verse-selection-toolbar';

  return (
    <div className={className} role="toolbar" aria-label="Verse selection actions">
      <p className="verse-selection-toolbar__summary">
        {selectionCount} verse{selectionCount === 1 ? '' : 's'} selected
        {feedback ? (
          <span className="verse-selection-toolbar__feedback" aria-live="polite">
            {feedback}
          </span>
        ) : null}
      </p>

      <div className="verse-selection-toolbar__actions">
        <button
          type="button"
          className="verse-selection-toolbar__btn"
          onClick={handleCopy}
        >
          <Copy size={16} strokeWidth={2} aria-hidden="true" />
          Copy Selected
        </button>

        <button
          type="button"
          className="verse-selection-toolbar__btn"
          onClick={addSelectedToStudyNote}
        >
          <NotebookPen size={16} strokeWidth={2} aria-hidden="true" />
          Add To Study Note
        </button>

        <div className="verse-selection-toolbar__highlight-group">
          <button
            type="button"
            className="verse-selection-toolbar__btn"
            onClick={() => setShowColors((open) => !open)}
            disabled={!isAuthenticated}
            title={isAuthenticated ? undefined : 'Sign in to save highlights'}
          >
            <Highlighter size={16} strokeWidth={2} aria-hidden="true" />
            Highlight Selected
          </button>

          {showColors && isAuthenticated ? (
            <div
              className="verse-selection-toolbar__palette"
              role="listbox"
              aria-label="Highlight color"
            >
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={
                    color === highlightColor
                      ? 'verse-selection-toolbar__swatch verse-selection-toolbar__swatch--active'
                      : 'verse-selection-toolbar__swatch'
                  }
                  data-color={color}
                  aria-label={color}
                  aria-selected={color === highlightColor}
                  onClick={() => {
                    setHighlightColor(color);
                    void handleHighlight(color);
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="verse-selection-toolbar__btn"
          onClick={() => void handleRemoveHighlight()}
          disabled={!isAuthenticated}
          title={isAuthenticated ? undefined : 'Sign in to manage highlights'}
        >
          <BookMarked size={16} strokeWidth={2} aria-hidden="true" />
          Remove Highlight
        </button>

        <button
          type="button"
          className="verse-selection-toolbar__btn verse-selection-toolbar__btn--ghost"
          onClick={clearSelection}
        >
          <X size={16} strokeWidth={2} aria-hidden="true" />
          Clear Selection
        </button>
      </div>
    </div>
  );
}
