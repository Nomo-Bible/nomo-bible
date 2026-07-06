import './PageBanner.css';

export interface PageBannerProps {
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

export function PageBanner({ imageSrc, imageAlt, className = '' }: PageBannerProps) {
  const classes = ['page-banner', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <img
        src={imageSrc}
        alt={imageAlt}
        className="page-banner__img"
        decoding="async"
      />
    </div>
  );
}
