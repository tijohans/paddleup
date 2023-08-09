import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import refreshToken from '../utils/RefreshToken'
const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    // Set the states to be used
    const [token, setToken] = useState(null)

    // useEffect to refresh the token when the AuthProvider is mounted to keep login even when site refreshes
    useEffect(() => {
        refreshToken()
            .then((jwt) => {
                // Refresh the token when the AuthProvider is mounted
                if (jwt) {
                    setToken(jwt)
                } else {
                    setToken(null)
                }
            })
            .catch((error) => {
                // Handle error if refreshing token fails
                console.error('Error refreshing token:', error)
                setToken(null)
            })
    }, [])

    return (
        // Apply the context provider to every child
        <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }
