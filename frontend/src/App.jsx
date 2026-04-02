import { SignInButton, SignOutButton, UserButton, useUser } from '@clerk/react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ProblemPage from './pages/ProblemPage';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';
import Problem from './pages/Problem';
import Leaderboard from './pages/Leaderboard';
import InterviewDashboard from './pages/InterviewDashboard';
import Interview from './pages/Interview';
import ResumeUpload from './pages/ResumeUpload';
import ResumeHistory from './pages/ResumeHistory';


function App() {

  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) return null // ⏳ wait for Clerk before rendering any route

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <Home /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isSignedIn ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/problems" element={isSignedIn ? <ProblemPage /> : <Navigate to="/" />} />
        <Route path="/problem/:id" element={isSignedIn ? <Problem /> : <Navigate to="/" />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/interview-dashboard" element={isSignedIn ? <InterviewDashboard /> : <Navigate to="/" />} />
        <Route path="/interview/:id" element={isSignedIn ? <Interview /> : <Navigate to="/" />} />
        <Route path="/resume-upload" element={isSignedIn ? <ResumeUpload /> : <Navigate to="/" />} />
        <Route path="/resume-history" element={isSignedIn ? <ResumeHistory /> : <Navigate to="/" />} />
      </Routes>

      <Toaster position='top-right' toastOptions={{ duration: 1500 }} />
    </>
  )
}

export default App