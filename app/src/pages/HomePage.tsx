import { Link } from 'react-router-dom';
import './HomePage.css';

export function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <h1 className="home-hero__title">Nomomartyria Bible Platform</h1>
        <p className="home-hero__motto">
          Per Legem et Testimonium, Christus Revelatur
        </p>
        <p className="home-hero__tagline">
          Through the Law and the Testimony, Christ is revealed.
        </p>
        <Link to="/reader" className="home-hero__cta">
          Open Bible Reader
        </Link>
      </section>

      <section className="home-intro">
        <h2>A Christ-Centered Biblical Learning Environment</h2>
        <p>
          The Nomomartyria Bible Platform exists to glorify God by helping people
          know Jesus Christ through the faithful study of His Word. Scripture is its
          own interpreter, and every doctrine, prophecy, and teaching must be
          understood through the harmonious witness of the whole Bible.
        </p>
      </section>

      <section className="home-modules">
        <h2>Platform Modules</h2>
        <ul className="home-modules__grid">
          <li className="home-modules__card home-modules__card--active">
            <h3>Bible Reader</h3>
            <p>The central reading environment where every study begins.</p>
            <Link to="/reader">Enter Reader →</Link>
          </li>
          <li className="home-modules__card home-modules__card--placeholder">
            <h3>Study Notes</h3>
            <p>Verse-by-verse educational commentary. Coming soon.</p>
          </li>
          <li className="home-modules__card home-modules__card--placeholder">
            <h3>Cross References</h3>
            <p>Biblical relationships between passages. Coming soon.</p>
          </li>
          <li className="home-modules__card home-modules__card--placeholder">
            <h3>Doctrine Library</h3>
            <p>Organized doctrinal studies. Coming soon.</p>
          </li>
        </ul>
      </section>
    </div>
  );
}
