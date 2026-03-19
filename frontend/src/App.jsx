import { Show, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ProblemPage from './pages/ProblemPage';
import { Toaster } from 'react-hot-toast';


function App() {

  const {isSignedIn} = useUser()

  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/problems" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
    </Routes>

    <Toaster position='top-right' toastOptions={{duration:1500}}/>
    </>
  )
}

export default App
