import { useContext, useState } from 'react'
import axios from 'axios'
import { showNotification } from '../utils/showNotification'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function useAuth(credentials) {
    const [authError, setAuthError] = useState()
    const { setToken } = useContext(AuthContext)
    const navigate = useNavigate()

    /**
     * Function for logging in a user with a username and password.
     *
     * @param {Object} credentials - The user's credentials.
     * @param {string} credentials.username - The username.
     * @param {string} credentials.password - The password.
     * @returns {Promise<boolean>} - A Promise that resolves to a boolean indicating the login status.
     */
    const login = async (credentials) => {
        // Set up an axios with baseURL defined and credentials to get the refreshToken saved in httponly
        const api = axios.create({
            baseURL: import.meta.env.VITE_BASE_API_URI,
            withCredentials: true
        })

        await api
            .post('/api/login', credentials)
            .then((res) => {
                // Formatting the jwt we get back from the server
                const jwt = res.data.accessToken.split(' ')[1]

                setToken(jwt)
                showNotification('Successful login!', 'success', 3000)
                navigate('/dashboard')
            })
            .catch((error) => {
                /* 
                    Setting server error to the error we get from the server
                    This will be displayed above the login button if we get it
                */
                setAuthError(error.response?.data?.error)
            })
    }

    const logout = async () => {
        // Set access token to null
        setToken(null)

        // Post logout API
        const api = axios.create({
            baseURL: import.meta.env.VITE_BASE_API_URI,
            withCredentials: true
        })

        await api
            .post('/api/logout')
            .then((res) => {
                showNotification('Successful logout!', 'success', 3000)
            })
            .catch((error) => {
                console.error('Something unexpected happened during logout')
                showNotification('Something unexpected happened during logout', 'error', 3000)
            })
    }

    /**
     * Function for registering a new user
     *
     * @param {{email, name, username, department, password}} credentials
     */
    const registerUser = async (credentials) => {
        axios
            .post('/api/register', credentials)
            .then((res) => {
                navigate('/checkEmail')
            })
            .catch((err) => {
                // Setting the server error to error, will be displayed above the form
                setAuthError(err.response.data.err)
                showNotification('Something went wrong, please try again', 'error', 3000)
            })
    }

    return { login, logout, registerUser, authError }
}
