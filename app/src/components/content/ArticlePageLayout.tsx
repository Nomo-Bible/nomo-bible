import type { ReactNode } from 'react';
import './ArticlePageLayout.css';

interface ArticlePageLayoutProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

export function ArticlePageLayout({ title, subtitle, children }: ArticlePageLayoutProps) {
  return (
    <div className="article-page">
      {(title || subtitle) && (
        <header className="article-page__header">
          {title && <h1 className="article-page__title">{title}</h1>}
          {subtitle && <p className="article-page__subtitle">{subtitle}</p>}
        </header>
      )}
      <div className="article-page__body study-article">{children}</div>
    </div>
  );
}
