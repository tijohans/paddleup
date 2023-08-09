import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'

export default function useMatches() {
    const [matches, setMatches] = useState(null)
    const [loadingMatches, setLoadingMatches] = useState(false)
    const { token } = useContext(AuthContext)

    // Function for fetching all players
    const fetchMatches = async () => {
        setLoadingMatches(true)
        try {
            axios
                .get(`/api/matches`, {
                    headers: { token }
                })
                .then((res) => {
                    const fetchedMatches = res.data
                    setMatches(fetchedMatches)
                })
                .catch((error) => {
                    console.error(error)
                })
        } catch (error) {
            console.error(error)
        } finally {
            setLoadingMatches(false)
        }
    }

    useEffect(() => {
        fetchMatches()
    }, [])

    return { matches, loadingMatches }
}
