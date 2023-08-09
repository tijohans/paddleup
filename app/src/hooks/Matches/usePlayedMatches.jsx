import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'

export default function usePlayedMatches() {
    const [playedMatches, setPlayedMatches] = useState()
    const [playedMatchesLoading, setPlayedMatchesLoading] = useState(false)
    const { token } = useContext(AuthContext)

    // Function for fetching all players
    const fetchPlayedMatches = async () => {
        setPlayedMatchesLoading(true)
        try {
            axios
                .get(`/api/matches/played`, {
                    headers: { token }
                })
                .then((res) => {
                    setPlayedMatches(res.data)
                })
                .catch((error) => {
                    console.error(error)
                })
        } catch (error) {
            console.error(error)
        } finally {
            setPlayedMatchesLoading(false)
        }
    }

    useEffect(() => {
        fetchPlayedMatches()
    }, [])

    return { playedMatches, playedMatchesLoading }
}
