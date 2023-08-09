import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { showNotification } from '../../utils/showNotification'
import { AuthContext } from '../../context/AuthContext'

export default function useValidateMatch() {
    const { roomid } = useParams()
    const navigate = useNavigate()
    const { token } = useContext(AuthContext)
    const [matchIsValid, setMatchIsValid] = useState(false)
    const [matchIsValidLoading, setMatchIsValidLoading] = useState(false)

    const checkMatchValid = () => {
        // * Check if match exists, is active and not completed.
        setMatchIsValidLoading(true)
        let room = roomid.toString()

        axios
            .get(`/api/matches/active/${room}`, {
                headers: { token }
            })
            .then((res) => {
                // If match is active, start the game
                setMatchIsValid(true)
            })
            .catch((error) => {
                console.warn('Server error: ' + error.response.data.error)

                if (!error.response.data?.active && error.response.data?.found) {
                    // Check the error to see if the match was found but not active, if so check if the match is complete.
                    axios
                        .get(`/api/matches/complete/${room}`, {
                            headers: { token }
                        })
                        .then(() => {
                            // If the match is complete, navigate to the completed match page.
                            showNotification(
                                'Match complete, redirecting to match page',
                                'warning',
                                3000
                            )
                            navigate(`/matches/${roomid}`, { replace: true })
                        })
                        .catch((error) => {
                            showNotification(error.response.data.error, 'error', 3000)
                            navigate('/dashboard', { replace: true })
                        })
                        .finally(() => {
                            return
                        })
                }

                // If the game is not found, send to matches page to get a new popup window
                if (!error.data?.active && !error.data?.found) {
                    navigate(`/matches/${room}`, { replace: true })
                }
            })
            .finally(() => {
                return setMatchIsValidLoading(false)
            })
    }

    useEffect(() => {
        // If there is no roomid present in the params, return to dashboard
        if (!roomid) {
            showNotification('Room ID not defined!', 'error', 3000)
            navigate('/dashboard', { replace: true })
        }

        // If there is no token present in the context, return to dashboard
        if (!token) {
            showNotification('You are not logged in!', 'error', 3000)
            navigate('/dashboard', { replace: true })
        }

        checkMatchValid()
    }, [])

    return { matchIsValid, matchIsValidLoading }
}
