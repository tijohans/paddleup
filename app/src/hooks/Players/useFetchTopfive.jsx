import { useEffect, useState } from 'react'
import axios from 'axios'
import { showNotification } from '../../utils/showNotification'

export default function useFetchTopfive() {
    const [topFivePlayers, setTopFivePlayers] = useState()
    const [topFivePlayersLoading, setTopFivePlayersLoading] = useState(true)

    const fetchTopFive = () => {
        //getting the top 5 the players from the database and sort them by points
        axios
            .get('/api/players/top5players')
            .then((res) => {
                setTopFivePlayers(res.data)
            })
            .catch((err) => {
                console.log(err)
                showNotification('Could not get top 5 players!', 'error', 3000)
            })
            .finally(setTopFivePlayersLoading(false))
    }

    useEffect(() => {
        fetchTopFive()
    }, [])

    return { topFivePlayers, topFivePlayersLoading }
}
