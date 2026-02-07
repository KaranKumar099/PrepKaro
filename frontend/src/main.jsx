import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import AuthPage from './components/AuthPage.jsx'
import User from './components/User.jsx'
import UserProfile from './components/UserProfile.jsx'
import Tool from './components/Tool.jsx'
import Layout from './layout.jsx'
import Exam from './components/Exam.jsx'
import ExamApp from './components/Exam2.jsx'
import Contact from './components/Contact.jsx'
import { useUserStore } from './store/UseUserStore.jsx'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import Dashboard from './components/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ExamHistory from './components/ExamHistory.jsx'
import ExamEvaluation from './components/EvaluationPage.jsx'
import { useEffect } from 'react'

const AppRoutes = ()=>{
  const fetchUser = useUserStore((state) => state.fetchUser);
  const { user, loading } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return <div>Loading...</div>; // or spinner
  }

  const router= createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      children: [
        {  path: "",  element: user ? <Dashboard/> : <Home/>},
        {  path: "/auth",  element: <AuthPage/>,},
        {  path: "/login",  element: <Login/>,},
        {  path: "/user",  element: <UserProfile/>,},
        {  path: "/history",  element: <ExamHistory/>,},
        {  path: "/tool",  element: (<ProtectedRoute><Tool/></ProtectedRoute>),},
        {  path: "/exam",  element: (<ExamApp/>),},
        {  path: "/attempt/:attemptId/",  element: (<ExamEvaluation/>),},
        {  path: "/contact",  element: <Contact/>,},
      ]
    }
  ])
  return < RouterProvider router={router} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <AppRoutes/>
  </StrictMode>
)
