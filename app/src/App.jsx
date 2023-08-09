// Axios configuration
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_BASE_API_URI

import { Route, Routes } from 'react-router-dom'

import Navigation from './components/Navigation/Navigation'
import NotFound from './components/errors/NotFound'
import Unathorized from './components/errors/Unauthorized'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Footer from './components/Footer/Footer'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginRegister/LoginPage'
import Dashboard from './pages/Dashboard/Dashboard'
import MatchesPage from './pages/MatchesPage/MatchesPage'
import RegisterPage from './pages/LoginRegister/RegisterPage'
import UserPage from './pages/UserPage/UserPage'
import AllUsers from './pages/AllUsers'
import LogoutPage from './pages/LogoutPage'
import UserEditPage from './pages/UserEditPage'
import CheckEmail from './pages/EmailCheck'
import Leaderboard from './pages/Leaderboard/Leaderboard'

import CookieConsent from 'react-cookie-consent'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'

import './App.css'
import AdminDashboard from './pages/AdminDashboard'
import MatchEditPage from './pages/MatchEditPage'
import EmailValidation from './pages/EmailValidation'
import OneMatch from './pages/MatchesPage/OneMatch'
import PlayMatch from './components/PlayMatch/PlayMatch'
import BookmarksPage from './pages/BookmarksPage/BookmarksPage'
import Sockets from './pages/Sockets'
import PersistLogin from './components/PersistLogin'

import { ToastContainer } from 'react-toastify'

function App() {
    const { token } = useContext(AuthContext)

    return (
        <div className="site">
            {/* ToastContainer for notifications */}
            <ToastContainer />
            {/* Static navigation to show on all pages */}
            <Navigation loggedin={token} />

            <Routes>
                {/* Testing route remove in prod */}
                <Route path="/ingame/:roomid" element={<PlayMatch />} />

                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/checkEmail" element={<CheckEmail />} />
                <Route path="/socket" element={<Sockets />} />
                <Route path="/emailValidation/:token" element={<EmailValidation />} />
                {/* Move this line above the wildcard route */}
                {/* Error Routes */}
                <Route path="*" element={<NotFound />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/unauthorized" element={<Unathorized />} />

                {/* Protected Routes */}
                <Route element={<PersistLogin />}>
                    <Route element={<ProtectedRoute loggedin={token} redirect="/unauthorized" />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/creatematch" element={<MatchEditPage />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />

                        <Route path="/users">
                            <Route index element={<AllUsers />} />
                            <Route path=":id" element={<UserPage />} />
                            <Route path=":id/edit" element={<UserEditPage />} />
                        </Route>

                        <Route path="/matches">
                            <Route index element={<MatchesPage />} />
                            <Route path=":id" element={<OneMatch />} />
                            <Route path=":id/edit" element={<MatchEditPage />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>

            {/* Using the cookie consent npm module for easier creating a cookie-consent popup */}
            <CookieConsent
                style={{ background: '#011627' }}
                buttonStyle={{
                    background: '#2EC4B6',
                    color: '#011627',
                    fontSize: '13px'
                }}
                onAccept={() => {
                    window.location.reload(false)
                }}
            >
                Welcome to PaddleUp! Just like a game of ping pong, by entering our site, you're
                agreeing to let us use cookies to personalize your experience! So, let's get the
                game rolling!
            </CookieConsent>

            <Footer />
        </div>
    )
}

export default App
