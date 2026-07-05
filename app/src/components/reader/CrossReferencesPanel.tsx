import './CrossReferencesPanel.css';

const PLACEHOLDER_REFS = [
  { ref: 'John 1:1', note: 'Creation through the Word' },
  { ref: 'Psalm 33:6', note: 'By the word of the Lord were the heavens made' },
  { ref: 'Hebrews 11:3', note: 'Worlds framed by the word of God' },
  { ref: '2 Corinthians 4:6', note: 'God commanded light to shine' },
];

export function CrossReferencesPanel() {
  return (
    <section className="cross-refs-panel" aria-label="Cross references">
      <header className="panel-header">
        <h3>Cross References</h3>
        <span className="panel-header__badge">Placeholder</span>
      </header>
      <ul className="cross-refs-panel__list">
        {PLACEHOLDER_REFS.map(({ ref, note }) => (
          <li key={ref} className="cross-refs-panel__item">
            <span className="cross-refs-panel__ref">{ref}</span>
            <span className="cross-refs-panel__note">{note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
