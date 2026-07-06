import { ArrowRight, BookOpen, Link2, Library, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageBanner } from '@/components/ui/PageBanner';
import homeBanner from '@/assets/banners/home.png';
import './HomePage.css';

export function HomePage() {
  return (
    <div className="home-page">
      <PageBanner
        imageSrc={homeBanner}
        imageAlt="Nomomartyria Bible Platform — Per Legem et Testimonium, Christus Revelatur"
        className="home-page__banner"
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
          <li className="home-modules__card">
            <Library className="home-modules__icon" aria-hidden="true" size={24} strokeWidth={1.75} />
            <h3>Study Notes</h3>
            <p>Verse-by-verse educational commentary in your study workspace.</p>
            <Link to="/reader?tab=study-notes" className="home-modules__link">
              Open Study Notes
              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            </Link>
          </li>
          <li className="home-modules__card">
            <Link2 className="home-modules__icon" aria-hidden="true" size={24} strokeWidth={1.75} />
            <h3>Cross References</h3>
            <p>Biblical relationships between passages for connected study.</p>
            <Link to="/reader?tab=cross-references" className="home-modules__link">
              Open Cross References
              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            </Link>
          </li>
          <li className="home-modules__card">
            <Search className="home-modules__icon" aria-hidden="true" size={24} strokeWidth={1.75} />
            <h3>Strong&apos;s Concordance</h3>
            <p>Look up Hebrew and Greek Strong&apos;s numbers, or search KJV verses by word.</p>
            <Link to="/reader?tab=concordance" className="home-modules__link">
              Open Concordance
              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            </Link>
          </li>
          <li className="home-modules__card">
            <Library className="home-modules__icon" aria-hidden="true" size={24} strokeWidth={1.75} />
            <h3>How to Study the Bible</h3>
            <p>
              A lesson guide on letting Scripture interpret itself—Christ-centered,
              line-upon-line study principles.
            </p>
            <Link to="/reader?tab=how-to-study" className="home-modules__link">
              Open Guide
              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
