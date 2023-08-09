import { useContext, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Button from '../components/Button/Button'
import axios from 'axios'
import { showNotification } from '../utils/showNotification'
import useAuth from '../hooks/useAuth'

export default function LogoutPage() {
    const { token, setToken } = useContext(AuthContext)
    const navigate = useNavigate()
    const { logout } = useAuth()

    useEffect(() => {
        /* 
            If the user is logged in ( a token is present ) 
            remove token (log out the user )
            and show them that they have been logged out,

            else redirect them to the landing page
        */
        if (token) {
            logout()
        } else {
            navigate('/')
        }
    }, [])

    return (
        <main>
            <section>
                <p>You have been successfully logged out.</p>
                <Button link="/login">Log in again?</Button>
            </section>
        </main>
    )
}
