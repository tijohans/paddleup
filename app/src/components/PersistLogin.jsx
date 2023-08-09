import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import RefreshToken from '../utils/RefreshToken'

const PersistLogin = () => {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const checkRefreshToken = async () => {
            try {
                await RefreshToken()
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoaded(true)
            }
        }

        checkRefreshToken()
    }, [])

    return <>{isLoaded && <Outlet />}</>
}

export default PersistLogin
