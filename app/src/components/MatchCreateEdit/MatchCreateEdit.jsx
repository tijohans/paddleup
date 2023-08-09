import { useEffect, useContext, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { showNotification } from '../../utils/showNotification'
import useMatch from '../../hooks/Matches/useMatch'
import { useForm } from 'react-hook-form'
import ReactLoading from 'react-loading'
import usePlayers from '../../hooks/Players/usePlayers'

export default function MatchEdit() {
    const { token } = useContext(AuthContext)
    const navigate = useNavigate()

    const { id } = useParams()
    const { match, loadingMatch } = useMatch(id)
    const { players, loadingPlayers } = usePlayers(match)

    const [edit, setEdit] = useState(false)

    const {
        register,
        watch,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm()

    const returnWinnerName = (p1id, p2id, p1username, p2username, winner) => {
        if (p1id === winner) {
            return p1username
        }

        if (p2id === winner) {
            return p2username
        }
    }

    useEffect(() => {
        if (id) {
            setEdit(true)
            if (!match) {
                return
            }
            reset({
                p1id: match.players.p1._id,
                p1username: match.players.p1.username,
                p1score: match.player1Score,
                p2id: match.players.p2._id,
                p2username: match.players.p2.username,
                p2score: match.player2Score,
                winner: match.winner,
                winnerName: returnWinnerName(
                    match.players.p1._id,
                    match.players.p2._id,
                    match.players.p1.username,
                    match.players.p2.username,
                    match.winner
                )
            })
        }
    }, [match])

    const onSubmit = (data) => {
        const formdata = {
            p1: data.p1id,
            p2: data.p2id,
            player1Score: data.p1score,
            player2Score: data.p2score,
            winner: data.winner,
            matchResult: data.p1score + '-' + data.p2score
        }

        if (data.p1score === data.p2score) {
            showNotification('Error: Match cannot be a tie', 'error', 3000)
            return
        }

        console.log(data.p1score)
        console.log(data.p2score)
        let combinedScore = Number(data.p1score) + Number(data.p2score)

        console.log(combinedScore)
        if (combinedScore > 5) {
            showNotification('Error: Results do not match rules', 'error', 3000)
            return
        }

        if (data.p1id === '(none)' || data.p2id === '(none)') {
            showNotification('Error: You need to select both players', 'error', 3000)
            return
        }

        if (data.p1id === data.p2id) {
            showNotification('Error: Players cannot be the same', 'error', 3000)
            return
        }

        if (edit) {
            axios
                .patch(`/api/matches/${id}`, formdata, {
                    headers: { token }
                })

                .then((res) => {
                    showNotification('Match updated successfully', 'success', 3000)
                    navigate('/matches')
                })
                .catch((err) => {
                    showNotification(err.response.data.message, 'error', 3000)
                    console.log('Error occurred during patch request:', err)
                })
        } else {
            axios
                .post(`/api/matches/`, formdata, {
                    headers: { token }
                })

                .then((res) => {
                    showNotification('Match created successfully', 'success', 3000)
                    navigate(`/matches/${res.data._id}`)
                })
                .catch((err) => {
                    showNotification(err.response.data.message, 'error', 3000)
                    console.log('Error occurred during create request:', err)
                })
        }
    }

    const setName = (data, players, plr) => {
        let newdata = {
            ...data
        }

        if (plr === 1) {
            newdata.p1username = players?.find((player) => player._id === data.p1id)?.username
        } else if (plr === 2) {
            newdata.p2username = players?.find((player) => player._id === data.p2id)?.username
        }

        reset(newdata)
    }

    const calculateWinner = (data) => {
        let winner
        let winnerName

        if (data.p1score > data.p2score) {
            winner = data.p1id
            winnerName = data.p1username
        } else if (data.p1score < data.p2score) {
            winner = data.p2id
            winnerName = data.p2username
        } else {
            winner = 'Tie (not allowed)'
            winnerName = '(none)'
        }

        reset({
            p1id: data.p1id,
            p1username: data.p1username,
            p1score: data.p1score,
            p2id: data.p2id,
            p2username: data.p2username,
            p2score: data.p2score,
            winner: winner,
            winnerName: winnerName
        })
    }
    return (
        <main>
            {loadingMatch && loadingPlayers ? (
                <ReactLoading />
            ) : (
                <>
                    {edit ? <h1>Edit Match:</h1> : <h1>Create Match:</h1>}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {edit ? (
                            <>
                                <label htmlFor="p1id">Player 1</label>
                                <small>Username: {watch('p1username')}</small>
                                <input {...register('p1id')} name="p1id" disabled />

                                <label htmlFor="p2id">Player 2:</label>
                                <small>Username: {watch('p2username')}</small>
                                <input {...register('p2id')} name="p2id" disabled />
                            </>
                        ) : (
                            <>
                                <label htmlFor="p1id">Player 1</label>
                                <select
                                    {...register('p1id', {
                                        onChange: () => {
                                            setName(watch(), players, 1)
                                            calculateWinner(watch())
                                        }
                                    })}
                                    id="p1id"
                                    name="p1id"
                                >
                                    <option disabled selected value="(none)">
                                        -
                                    </option>
                                    {players &&
                                        players.map((player) => (
                                            <option key={player._id} value={player._id}>
                                                {player.username}
                                            </option>
                                        ))}
                                </select>

                                {errors.p1id && (
                                    <small id="p1id-helper" role="alert">
                                        {errors.p1id.message}
                                    </small>
                                )}

                                <label htmlFor="p2id">Player 2:</label>
                                <select
                                    {...register('p2id', {
                                        onChange: () => {
                                            setName(watch(), players, 2)
                                            calculateWinner(watch())
                                        }
                                    })}
                                    id="p2id"
                                    name="p2id"
                                >
                                    <option disabled selected value="(none)">
                                        -
                                    </option>
                                    {players &&
                                        players.map((player) => (
                                            <option key={player._id} value={player._id}>
                                                {player.username}
                                            </option>
                                        ))}
                                </select>

                                {errors.p2id && (
                                    <small id="p2id-helper" role="alert">
                                        {errors.p2id.message}
                                    </small>
                                )}
                            </>
                        )}

                        <label htmlFor="p1score">{watch('p1username')}'s score</label>
                        <input
                            {...register('p1score', {
                                onChange: () => {
                                    calculateWinner(watch())
                                },
                                required: 'Player 1 score is required.'
                            })}
                            type="number"
                            id="p1score"
                            min={0}
                            max={3}
                            aria-invalid={errors.p1score ? 'true' : 'none'}
                            aria-describedby="p1score-helper"
                        />

                        {errors.p1score && (
                            <small id="p1score-helper" role="alert">
                                {errors.p1score.message}
                            </small>
                        )}

                        <label htmlFor="p2score">{watch('p2username')}'s score</label>
                        <input
                            {...register('p2score', {
                                onChange: () => {
                                    calculateWinner(watch())
                                },
                                required: 'Player 2 score is required.'
                            })}
                            type="number"
                            id="p2score"
                            min={0}
                            max={3}
                            aria-invalid={errors.p2score ? 'true' : 'none'}
                            aria-describedby="p2score-helper"
                        />

                        {errors.p2score && (
                            <small id="p2score-helper" role="alert">
                                {errors.p2score.message}
                            </small>
                        )}

                        <label htmlFor="winner">Winner</label>
                        <small>Username: {watch('winnerName')}</small>
                        <input {...register('winner')} type="text" id="winner" readOnly />

                        <button type="submit">Save</button>
                    </form>
                </>
            )}
        </main>
    )
}
