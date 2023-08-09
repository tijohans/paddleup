import { useContext, useEffect, useRef, useState } from 'react'
import TableTennisCounter, { Match, Game } from './TableTennisCounter'
import io from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import { showNotification } from '../../utils/showNotification'
const socketURL = import.meta.env.VITE_BASE_API_URI

export default function TableTennisWrapper(props) {
    const tableTennisRef = useRef(null)
    const [currentMatch, setCurrentMatch] = useState({})
    const [connected, setConnected] = useState(false)
    const [playerNumber, setPlayerNumber] = useState(0)
    const [zocket, setZocket] = useState(null)
    const { token } = useContext(AuthContext)
    const navigate = useNavigate()

    const sendMatch = async (data) => {
        let playerScore = calculateScoreFromMatch(data.match.games)
        let tempMatch = {
            p1: data.match.plr1id,
            p2: data.match.plr2id,
            winner: data.match.winnerid,
            player1Score: playerScore.p1,
            player2Score: playerScore.p2,
            matchResult: `${playerScore.p1} - ${playerScore.p2}`,
            readableId: props.roomid
        }
        try {
            await axios.post(`/api/matches/completematch`, tempMatch, {
                headers: { token }
            })
        } catch (error) {
            console.log(error)
        }
    }
    const calculateScoreFromMatch = (games) => {
        let p1 = 0,
            p2 = 0
        games.map((game) => {
            if (game.winner === 1) p1++
            if (game.winner === 2) p2++
        })
        return { p1, p2 }
    }

    useEffect(() => {
        // Connect to the socket server
        const socket = io.connect(socketURL)
        // Set the 'zocket', so other functions can use the same socket connection
        setZocket(socket)

        // Get the room id from the props, and connect to it on the socket server
        let room = props.roomid
        socket.emit('join_room', room)

        // Navigate away if the room is full (checked on the server on join) and display a message
        socket.on('room_full', () => {
            showNotification("Can't connect, room is full!", 'error', 3000)
            navigate('/dashboard')
        })

        // Socket connection for "receive_match" - to receive matches
        socket.on('receive_match', (data) => {
            // Set the current match to the match data gotten
            setCurrentMatch(data.match)
        })

        // Socket connection for "connection" - will fire as soon as a player joins the room
        socket.on('connection', (data) => {
            // Emit the server message to the console
            console.log('Server message: ' + data.message)

            if (data.message) {
                if (data.playerNumber === 1) {
                    // If the player number returned from the server is player 1, set the player number.
                    console.log('Player 1 connected!')
                    setPlayerNumber(1)
                    // player 1 actions
                } else if (data.playerNumber === 2) {
                    // If the player number returned from the server is player 2,
                    // Set the player number, but also emit the second data's player to the server to share with player 1.
                    setPlayerNumber(2)
                    console.log('Player 2 connected!')
                    socket.emit('share_data_player2', {
                        username: props.player.username,
                        id: props.player._id,
                        room: props.roomid
                    })

                    // Set the connection to true, which will remove the waiting for players text.
                    setConnected(true)
                }
            }
        })

        if (playerNumber !== 2) {
            // ? Connection for player 1 only
            // Socket connection for "send_data_player2":
            // 1. As player 1, retrieve a connection, id and username from player 2
            // 2. Send the match data, now with correct information - back to player 2
            // 3. Set "connected" to true for player 1 and start the game

            socket.on('send_data_player2', (data) => {
                // Create a new temp match using the class from the original component
                let tempMatch = new Match()

                // Create an updated match object with the new correct information, copying the tempMatch first
                const updatedMatch = {
                    ...tempMatch,
                    plr1name: props.player.username,
                    plr1id: props.player._id,
                    plr2name: data.username,
                    plr2id: data.id
                }

                // Check if player 1 and 2 share the same ID, this is not allowed - and you will be sent to the dashboard again.
                if (props.player._id === data.id) {
                    console.error("Error: You can't play against yourself!")
                    navigate('/dashboard')
                }

                // Set the current match to the updated match
                setCurrentMatch(updatedMatch)
                // Emit a socket with the roomid and the match to start the game for player 2
                let room = props.roomid
                let match = updatedMatch
                socket.emit('send_match', { match, room })

                // Set the connection to true, which will remove the waiting for players text.
                setConnected(true)
            })
        }
        // Socket connection for "match_complete", will listen to this and send the match to the server and mark as completed.
        // It will also make sure only player 1 sends the actual information to the server.
        socket.on('match_complete', (data) => {
            if (playerNumber !== 2) {
                try {
                    // Push up the changes here (data) if player 1
                    sendMatch(data)
                } catch (error) {
                    console.log(error)
                } finally {
                    // Show notification based on points given
                    // Navigate to the match result page
                    if (data.match.winnerid === props.player._id) {
                        showNotification(
                            'You gained three points, congratulations!',
                            'success',
                            3000
                        )
                    } else {
                        showNotification(
                            'You gained one point, better luck next time.',
                            'success',
                            3000
                        )
                    }
                    navigate(`/matches/${props.roomid}`)
                }
            } else {
                navigate('/matches')
            }
        })

        return () => {
            // Turn off all incoming sockets and disconnect on return.
            socket.off('receive_match')
            socket.off('connection')
            socket.off('send_data_player2')
            socket.off('match_complete')
            socket.disconnect()
        }
    }, [])

    // Function to run when the table tennis component's "updatematch" event fires
    const updateEvent = (event) => {
        if (connected) {
            // Make sure we are connected, and not waiting for players
            // Set the current matc
            setCurrentMatch(event.detail.match)

            // Emit the updated match.
            let room = props.roomid
            // State is too slow before emitting, so we set the "match" variable directly to the event.detail.match.
            let match = event.detail.match
            zocket.emit('send_match', { match, room })
        }
    }

    // Function to run when the table tennis component's "finishmatch" event fires
    const finishEvent = (event) => {
        if (connected) {
            // Still make sure we are connected
            // Emit the final match to the server
            let room = props.roomid
            let match = event.detail.match
            zocket.emit('finish_match', { match, room })
        }
    }

    useEffect(() => {
        // Create a new instance of the vanilla JS component
        const tableTennisCounter = new TableTennisCounter()
        // Set attributes gotten from props
        const matchString = JSON.stringify(currentMatch)
        tableTennisCounter.setAttribute('match', matchString)
        // Append the child to the current reference, and the eventlisteners to listen to the events from the component
        tableTennisRef.current.appendChild(tableTennisCounter)
        tableTennisRef.current.addEventListener('updatematch', updateEvent)
        tableTennisRef.current.addEventListener('finishmatch', finishEvent)

        return () => {
            // Clean up the element when the component unmounts
            if (tableTennisRef.current) {
                tableTennisRef.current.removeChild(tableTennisCounter)
                tableTennisRef.current.removeEventListener('updatematch', updateEvent)
                tableTennisRef.current.removeEventListener('finishmatch', finishEvent)
            }
        }
    }, [currentMatch])

    return (
        <>
            {connected ? null : (
                <div className="ingame_center">
                    <p>(Share this with the user you want to play against!)</p>
                    <h2>Waiting for players..</h2>
                </div>
            )}

            {/* Return the table tennis counter as a new reference */}
            <div ref={tableTennisRef} />
        </>
    )
}
