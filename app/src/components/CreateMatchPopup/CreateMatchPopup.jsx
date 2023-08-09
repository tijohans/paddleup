import { useContext, useState } from 'react'
import DashboardButton from '../DashboardButton/DashboardButton'
import './CreateMatchPopup.css'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import LoadingOverlay from '../../utils/LoadingOverlay/LoadingOverlay'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import jwt_decode from 'jwt-decode'

export default function CreateMatchPopup({ isOpen, toggleIsOpen, text, forceOpen }) {
    const [joinMatch, setJoinMatch] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { token } = useContext(AuthContext)

    const getPlayerId = () => {
        if (!token) return

        return jwt_decode(token).sub
    }

    const toggleJoinMatch = () => {
        setJoinMatch(!joinMatch)
    }

    const initializeMatch = async () => {
        const res = await axios.post(
            `/api/matches/initmatch`,
            {
                p1: getPlayerId()
            },
            {
                headers: {
                    token
                }
            }
        )

        const roomId = res.data.readableId
        if (!roomId) return

        navigate(`/ingame/${roomId}`)
    }

    // Function to verify if the player already has an active match that they have not finished
    const verifyMatch = async () => {
        setLoading(true)
        axios
            .get(`/api/matches/verify/${getPlayerId()}`, {
                headers: { token }
            })
            .then((res) => {
                // If there is an active match with the player id found, navigate there
                if (res.data.hasMatch) {
                    console.warn(
                        `Unfinished game played (${res.data.roomid}), navigating user to that game.`
                    )
                    navigate(`/ingame/${res.data.roomid}`)
                } else {
                    // If not, initialize a new match
                    initializeMatch()
                }
            })
            .catch((error) => {
                console.error(error.response.data.error)
                navigate('/dashboard')
            })
    }

    return (
        <dialog open={forceOpen ? true : isOpen}>
            {loading && <LoadingOverlay>Creating a match</LoadingOverlay>}
            <article className="article__popup">
                {text && <h2>{text}</h2>}

                {joinMatch ? (
                    <JoinMatch toggleJoinMatch={toggleJoinMatch} />
                ) : (
                    <>
                        <DashboardButton variant={1} onClick={verifyMatch}>
                            Create a match
                        </DashboardButton>
                        <DashboardButton variant={4} onClick={toggleJoinMatch}>
                            Join a match
                        </DashboardButton>
                        {forceOpen ? '' : <button onClick={toggleIsOpen}>Close</button>}
                    </>
                )}
            </article>
        </dialog>
    )
}

/**
 * @Component for displaying the UI to join a match
 *
 * @param {toggleJoinMatch} Function Takes in functin to toggle button
 * @returns {void}
 */
function JoinMatch({ toggleJoinMatch }) {
    const [loading, setLoading] = useState(false)
    const [matchId, setMatchId] = useState(null)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    /**
     * Handling form submission
     *
     * @param {Object} data
     * @returns {void}
     */
    const onSubmit = (data) => {
        setLoading(true)
        setMatchId(data.roomId)

        try {
            navigate(`/ingame/${data.roomId}`)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {loading && <LoadingOverlay>Trying to join match {matchId}</LoadingOverlay>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="number" name="roomId" {...register('roomId', { required: true })} />
                {errors.roomId && <p className="error">Room id is required</p>}
                <input type="submit" value="Join" />
            </form>

            <button onClick={toggleJoinMatch}>Back</button>
        </>
    )
}
