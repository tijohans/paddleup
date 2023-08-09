import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

export default function useMatches(id) {
    const [match, setMatch] = useState(null)
    const [loadingMatch, setLoadingMatch] = useState(false)
    const { token } = useContext(AuthContext)

    // Function for fetching one match
    const fetchMatch = async () => {
        setLoadingMatch(true)
        try {
            axios
                .get(`/api/matches/${id}`, {
                    headers: { token }
                })
                .then((res) => {
                    const fetchedMatch = res.data
                    setMatch(fetchedMatch)
                })
                .catch((error) => {
                    console.error(error)
                })
        } catch (error) {
            console.error(error)
        } finally {
            setLoadingMatch(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchMatch()
        }
    }, [])

    return { match, loadingMatch }
}
