import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'

export default function usePlayers(playersTrigger) {
    const [players, setPlayers] = useState(null)
    const [playersLoading, setPlayersLoading] = useState(false)
    const { token } = useContext(AuthContext)

    useEffect(() => {
        setPlayersLoading(true)
        axios
            .get('/api/players/', {
                headers: { token }
            })
            .then((res) => {
                setPlayers(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(setPlayersLoading(false))
    }, [token, playersTrigger])

    return { players, playersLoading }
}
