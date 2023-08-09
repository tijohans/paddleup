import './Navigation.css'
import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import { alertConfirm } from '../../utils/confirmAlert'
import useUserInfo from '../../hooks/useUserInfo'

export default function Navigation({ loggedin }) {
    const { token } = useContext(AuthContext)
    const navigate = useNavigate()
    const { userId, userRole } = useUserInfo()

    // Checking if the user id logged in and getting the user id from the token
    useEffect(() => {
        if (!loggedin) return
    }, [loggedin])

    /* 
        Function for confirming that the user will log out 
        Preventing the user from loggin out if it was a misclick
    */
    const confirmLogout = () => {
        alertConfirm('Log out', 'Are you sure you want to log out?', logout)
    }

    const logout = () => {
        navigate('/logout')
    }

    return (
        <nav className="nav">
            {/* 
                Weird markup as a result of us using a classless system for styling the page 
                www.picocss.com
            */}
            <ul>
                <li>
                    <Link to={loggedin ? '/dashboard' : '/'}>
                        <img src="/logo.svg" alt="PaddleUp! Logo" className="nav__logo" />
                    </Link>
                </li>
            </ul>

            {/* 
                Again weird markup as a result of styling system 
                https://picocss.com/docs/dropdowns.html
             */}
            <ul>
                <li>
                    <details className="dropdown">
                        <summary>Menu</summary>
                        <ul dir="rtl">
                            {/* Deciding which menu items to show based on if the user is logged in */}
                            {loggedin ? (
                                <>
                                    <li>
                                        <Link to="/dashboard">Dashboard</Link>
                                    </li>

                                    <li onClick={() => confirmLogout()}>Log out</li>
                                </>
                            ) : (
                                <li>
                                    <Link to="/login">Login</Link>
                                </li>
                            )}
                        </ul>
                    </details>
                </li>
            </ul>
        </nav>
    )
}
