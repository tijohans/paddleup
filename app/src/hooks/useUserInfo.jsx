import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import jwt_decode from 'jwt-decode'

export default function useUserInfo() {
    const { token } = useContext(AuthContext)
    const [userId, setUserId] = useState(null)
    const [userRole, setUserRole] = useState(null)

    useEffect(() => {
        if (!token) return

        setUserId(jwt_decode(token).sub)
        setUserRole(jwt_decode(token).role)
    }, [token])

    return { userId, userRole }
}
