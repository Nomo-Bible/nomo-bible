import { Routes, Route } from 'react-router-dom';
import { GlobalLayout } from '@/components/layout/GlobalLayout';
import { HomePage } from '@/pages/HomePage';
import { BibleReaderPage } from '@/pages/BibleReaderPage';

export function App() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route index element={<HomePage />} />
        <Route path="reader" element={<BibleReaderPage />} />
      </Route>
    </Routes>
  );
}
