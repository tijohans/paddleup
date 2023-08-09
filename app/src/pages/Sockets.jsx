import React from 'react'
import io from 'socket.io-client'
import { useEffect, useState } from 'react'

function Sockets() {
    const socket = io.connect('http://localhost:4005')

    const [message, setMessage] = useState('')
    const [messageRecieved, setMessageRecieved] = useState('')
    const [room, setRoom] = useState('')

    const joinRoom = () => {
        if (room !== '') {
            socket.emit('join_room', room)
        }
    }

    const sendMessage = () => {
        socket.emit('send_message', { message, room })
    }

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessageRecieved(data.message)
        })
    }, [socket])
    return (
        <>
            <div>Sockets</div>
            <h1>ETTIF</h1>
            <input
                type="text"
                placeholder="Room Number"
                onChange={(e) => {
                    setRoom(e.target.value)
                }}
            />
            <button onClick={joinRoom}>Join Room</button>
            <input
                type="text"
                placeholder="message"
                onChange={(e) => {
                    setMessage(e.target.value)
                }}
            />
            <button onClick={sendMessage}>send that message samsung fridge </button>
            <h2>cool message from other guys:</h2>
            <p>{messageRecieved}</p>
        </>
    )
}

export default Sockets
