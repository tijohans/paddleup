import { useEffect, useState } from 'react'
import axios from 'axios'
import { showNotification } from '../utils/showNotification'
import { useNavigate, useParams } from 'react-router-dom'

export default function useValidateEmail() {
    const { token } = useParams()
    const [isTokenReady, setIsTokenReady] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            setIsTokenReady(true)
        }
    }, [token])

    const validateEmail = async () => {
        if (!isTokenReady) return

        await axios
            .post(`/api/emailValidation/${token}`, { token })
            .then((res) => {
                showNotification('Email validated!', 'success', 3000)
                navigate('/login')
            })
            .catch((error) => {
                showNotification('Email already validated!', 'success', 3000)
                navigate('/login')
                console.log(error)
            })
    }

    return { validateEmail }
}
