import './HeroBanner.css';

export interface HeroBannerProps {
  title: string;
  subtitle?: string;
  motto?: string;
  /** Optional panoramic artwork — leave unset for elegant placeholder */
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

export function HeroBanner({
  title,
  subtitle,
  motto,
  imageSrc,
  imageAlt = '',
  className = '',
}: HeroBannerProps) {
  const classes = ['hero-banner', className].filter(Boolean).join(' ');

  return (
    <header className={classes}>
      <div
        className={
          imageSrc ? 'hero-banner__art hero-banner__art--image' : 'hero-banner__art'
        }
        role={imageSrc ? 'img' : undefined}
        aria-label={imageSrc ? imageAlt || title : undefined}
        style={imageSrc ? { backgroundImage: `url(${imageSrc})` } : undefined}
      >
        {!imageSrc && <div className="hero-banner__art-placeholder" aria-hidden="true" />}
      </div>

      <div className="hero-banner__content">
        <h1 className="hero-banner__title">{title}</h1>
        {subtitle && <p className="hero-banner__subtitle">{subtitle}</p>}
        {motto && (
          <p className="hero-banner__motto" lang="la">
            {motto}
          </p>
        )}
      </div>
    </header>
  );
}
