import { Routes, Route } from 'react-router-dom';
import { GlobalLayout } from '@/components/layout/GlobalLayout';
import { LoginPage } from '@/components/auth/LoginPage';
import { SignupPage } from '@/components/auth/SignupPage';
import { HomePage } from '@/pages/HomePage';
import { BibleReaderPage } from '@/pages/BibleReaderPage';
import { RepositoryPage } from '@/pages/RepositoryPage';
import { AboutPage } from '@/pages/AboutPage';
import { AccountPage } from '@/pages/AccountPage';

export function App() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route index element={<HomePage />} />
        <Route path="reader" element={<BibleReaderPage />} />
        <Route path="repository" element={<RepositoryPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="account" element={<AccountPage />} />
      </Route>
    </Routes>
  );
}
