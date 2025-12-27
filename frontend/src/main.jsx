import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import AuthPage from './components/AuthPage.jsx'
import User from './components/User.jsx'
import Tool from './components/Tool.jsx'
import Tool2 from './components/Tool2.jsx'
import Layout from './layout.jsx'
import Exam from './components/Exam.jsx'
import ExamApp from './components/Exam2.jsx'
import Contact from './components/Contact.jsx'
import { QuestionProvider } from './context/questionsContext.jsx'
import { UserProvider, useUser } from './context/userContext.jsx'
import Login from './components/login.jsx'
import Home from './components/Home.jsx'
import Dashboard from './components/Dashboard.jsx'
import Dashboard2 from './components/Dashboard2.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ExamHistory from './components/ExamHistory.jsx'
import ExamHistory2 from './components/ExamHistory2.jsx'
import ExamEvaluation from './components/EvaluationPage.jsx'

const AppRoutes = ()=>{
  const {user} = useUser()
  const router= createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      children: [
        {
          path: "",
          element: (user ? <Dashboard2/> : <Home/>),
        },
        {
          path: "/auth",
          element: <AuthPage/>,
        },
        {
          path: "/login",
          element: <Login/>,
        },
        {
          path: "/user",
          element: <User/>,
        },
        {
          path: "/history",
          element: <ExamHistory2/>,
        },
        {
          path: "/tool",
          element: (<ProtectedRoute><Tool2/></ProtectedRoute>),
        },
        {
          path: "/exam",
          element: (<ExamApp/>),
        },
        {
          path: "/attempt/:attemptId/",
          element: (<ExamEvaluation/>),
        },
        {
          path: "/contact",
          element: <Contact/>,
        },
  
      ]
    }
  ])
  return < RouterProvider router={router} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <QuestionProvider>
        <AppRoutes/>
      </QuestionProvider>
    </UserProvider>
  </StrictMode>
)
