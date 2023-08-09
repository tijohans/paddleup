import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'

export default function useMatch(matchId) {
    const [match, setMatch] = useState()
    const [matchLoading, setMatchLoading] = useState(true)
    const { token } = useContext(AuthContext)

    const getMatch = async () => {
        try {
            const response = await axios.get(`/api/matches/${matchId}`, {
                headers: { token }
            })
            setMatch(response.data)
        } catch (error) {
            console.error(error)
        } finally {
            setMatchLoading(false)
        }
    }

    useEffect(() => {
        if (!matchId) return

        getMatch()
    }, [])

    return { match, matchLoading }
}
