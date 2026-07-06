import { Routes, Route } from 'react-router-dom';
import { GlobalLayout } from '@/components/layout/GlobalLayout';
import { HomePage } from '@/pages/HomePage';
import { BibleReaderPage } from '@/pages/BibleReaderPage';
import { RepositoryPage } from '@/pages/RepositoryPage';
import { AboutPage } from '@/pages/AboutPage';

export function App() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route index element={<HomePage />} />
        <Route path="reader" element={<BibleReaderPage />} />
        <Route path="repository" element={<RepositoryPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}
