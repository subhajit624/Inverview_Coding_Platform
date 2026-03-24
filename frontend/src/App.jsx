import { SignInButton, SignOutButton, UserButton, useUser } from '@clerk/react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ProblemPage from './pages/ProblemPage';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';
import Problem from './pages/Problem';
import Leaderboard from './pages/Leaderboard';


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
      </Routes>

      <Toaster position='top-right' toastOptions={{ duration: 1500 }} />
    </>
  )
}

export default App