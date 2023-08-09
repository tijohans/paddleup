import { useEffect, useState } from 'react'
import axios from 'axios'
import { showNotification } from '../../utils/showNotification'

export default function useFetchPlayernumber() {
    const [playerNumber, setPlayerNumber] = useState()
    const [playerNumberLoading, setPlayerNumberLoading] = useState(true)

    const fetchPlayernumber = () => {
        axios
            .get('/api/players/playernumber')
            .then((res) => {
                setPlayerNumber(res.data.playerNumber)
            })
            .catch((err) => {
                console.error(err)
                showNotification('Could not fetch player number!', 'error', 3000)
            })
            .finally(setPlayerNumberLoading(false))
    }

    useEffect(() => {
        fetchPlayernumber()
    }, [])

    return { playerNumber, playerNumberLoading }
}
