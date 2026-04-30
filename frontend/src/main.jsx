import { StrictMode, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import Layout from './layout.jsx';
import AuthPage from './components/AuthPage.jsx';
import UserProfile from './components/UserProfile.jsx';
import Tool from './components/Tool.jsx';
import Exam from './components/Exam.jsx';
import Home from './components/Home.jsx';
import Dashboard from './components/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ExamHistory from './components/ExamHistory.jsx';
import ExamEvaluation from './components/EvaluationPage.jsx';
import Downloads from './components/Downloads.jsx';
import Performance from './components/Performance.jsx';
import { useUserStore } from './store/UseUserStore.jsx';
import { useThemeStore } from './store/UseThemeStore.jsx';

import './index.css';

const App = () => {
  const { user, loading, fetchUser } = useUserStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const router = useMemo(() => createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '', element: user ? <Dashboard /> : <Home /> },
        { path: '/auth', element: <AuthPage /> },
        { path: '/user', element: <UserProfile /> },
        { path: '/history', element: <ExamHistory /> },
        {
          path: '/tool',
          element: (
            <ProtectedRoute>
              <Tool />
            </ProtectedRoute>
          ),
        },
        { path: '/exam', element: <Exam /> },
        { path: '/attempt/:attemptId/', element: <ExamEvaluation /> },
        {
          path: '/downloads',
          element: (
            <ProtectedRoute>
              <Downloads />
            </ProtectedRoute>
          ),
        },
        {
          path: '/performance',
          element: (
            <ProtectedRoute>
              <Performance />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]), [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
            PrepKaro Loading...
          </p>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

