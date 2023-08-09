import { useEffect, useState } from 'react'
import axios from 'axios'
import { showNotification } from '../../utils/showNotification'

export default function useFetchMatchnumber() {
    const [matchNumber, setMatchNumber] = useState()
    const [matchNumberLoading, setMatchNumberLoading] = useState(true)

    const fetchMatchNumber = () => {
        // Fetching the public matchnumber endpoint to get the number of matches ot display
        axios
            .get('/api/matches/matchnumber')
            .then((res) => {
                setMatchNumber(res.data.matchNumber)
            })
            .catch((err) => {
                console.log(err)
                showNotification('Could not fetch match number!', 'error', 3000)
            })
            .finally(setMatchNumberLoading(false))
    }

    useEffect(() => {
        fetchMatchNumber()
    }, [])

    return { matchNumber, matchNumberLoading }
}
