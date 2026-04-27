import { StrictMode, useEffect } from 'react';
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
import { useUserStore } from './store/UseUserStore.jsx';

import './index.css';

const AppRoutes = () => {
  const { user, loading, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
            PrepKaro Loading...
          </p>
        </div>
      </div>
    );
  }

  const router = createBrowserRouter([
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
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AppRoutes />
    </StrictMode>,
  );
}

