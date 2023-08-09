import { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import { showNotification } from '../../utils/showNotification'

export default function usePlayer(playerId) {
    const [player, setPlayer] = useState()
    const [playerLoading, setPlayerLoading] = useState(true)
    const { token } = useContext(AuthContext)

    useEffect(() => {
        setPlayerLoading(true)

        if (!playerId || !token) return

        axios
            .get(`/api/players/${playerId}`, {
                headers: { token }
            })
            .then((res) => {
                if (res.data) {
                    setPlayer(res.data)
                } else {
                    showNotification('Invalid player data', 'error', 3000)
                }
            })
            .catch((err) => {
                showNotification(err.response.data.message, 'error', 3000)
                console.error(err)
            })
            .finally(() => {
                setPlayerLoading(false)
            })
    }, [playerId, token])

    return { player, playerLoading }
}
