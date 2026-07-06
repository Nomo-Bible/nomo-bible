import { ArrowRight, BookOpen, Link2, Library } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroBanner } from '@/components/ui/HeroBanner';
import './HomePage.css';

export function HomePage() {
  return (
    <div className="home-page">
      <HeroBanner
        title="Nomomartyria Bible Platform"
        subtitle="Through the Law and the Testimony, Christ is revealed."
        motto="Per Legem et Testimonium, Christus Revelatur"
      />

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
            <BookOpen className="home-modules__icon" aria-hidden="true" size={24} strokeWidth={1.75} />
            <h3>Bible Reader</h3>
            <p>The central reading environment where every study begins.</p>
            <Link to="/reader" className="home-modules__link">
              Enter Reader
              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            </Link>
          </li>
          <li className="home-modules__card home-modules__card--placeholder">
            <Library className="home-modules__icon" aria-hidden="true" size={24} strokeWidth={1.75} />
            <h3>Study Notes</h3>
            <p>Verse-by-verse educational commentary. Coming soon.</p>
          </li>
          <li className="home-modules__card home-modules__card--placeholder">
            <Link2 className="home-modules__icon" aria-hidden="true" size={24} strokeWidth={1.75} />
            <h3>Cross References</h3>
            <p>Biblical relationships between passages. Coming soon.</p>
          </li>
          <li className="home-modules__card home-modules__card--placeholder">
            <Library className="home-modules__icon" aria-hidden="true" size={24} strokeWidth={1.75} />
            <h3>Doctrine Library</h3>
            <p>Organized doctrinal studies. Coming soon.</p>
          </li>
        </ul>
      </section>
    </div>
  );
}
