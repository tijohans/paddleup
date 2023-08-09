import 'dotenv/config'
import express from 'express'
import chalk from 'chalk'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import { Server } from 'socket.io'

import { playerRouter } from './routes/playerRouter.js'
import { matchesRouter } from './routes/matchesRouter.js'
import { authRouter } from './routes/authRouter.js'
import { validationRouter } from './routes/validationRouter.js'

import swaggerUI from 'swagger-ui-express'
import { swaggerDocument } from './swagger/swagger.js'

const app = express()

// * Database connection
mongoose.connect(process.env.DB_CONNECTION)

const corsOptions = {
    origin: `http://localhost:${process.env.CORS_PORT}`,
    credentials: true
}

// * Middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// * Routes
app.use('/api', authRouter)
app.use('/api/players', playerRouter)
app.use('/api/matches', matchesRouter)
app.use('/api/emailValidation', validationRouter)

// * Swagger
app.use(
    '/docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument, {
        customSiteTitle: 'PaddleUP API',
        customfavIcon: './swagger/favicon.svg',
        withCredentials: true
    })
)

// * Socket.io  --------------------------------------
const socketServer = http.createServer(app)
const io = new Server(socketServer, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log(`Global: Player connected to socket: ${socket.id}`)

    socket.on('send_match', (data) => {
        io.to(data.room).emit('receive_match', data)
        console.log(`Room ${data.room}: User ${socket.id} sent data!`)
    })

    socket.on('join_room', async (data) => {
        const roomUsers = await io.in(data).allSockets()

        if (roomUsers.size < 2) {
            socket.join(data)
            console.log(`Room ${data}: Player connected: ${socket.id}!`)
            const roomUsers = await io.in(data).allSockets()
            console.log(`Room ${data}: Trying to emit connection data to room.`)
            io.to(data).emit('connection', {
                message: `Connected to ${data}!`,
                playerNumber: roomUsers.size
            })
            console.log(
                `Room ${data}: There are now ${roomUsers.size} person(s) connected in the room.`
            )
        } else {
            console.log(`Room ${data}: Connection refused (ROOM FULL) from: ${socket.id}`)
            io.to(socket.id).emit('room_full')
        }
    })
    // Socket to listen for when a second player joins, then send this data to the first player ("host")
    socket.on('share_data_player2', (data) => {
        console.log(`Room ${data.room}: Player 2 data shared with player 1`)
        socket.to(data.room).emit('send_data_player2', data)
    })

    socket.on('finish_match', (data) => {
        console.log('Match complete for room ' + data.room)
        io.to(data.room).emit('match_complete', data)
    })
})
// * ------------------------------------------------

const PORT = process.env.PORT || 3000
socketServer.listen(PORT, () => {
    console.log('server running on:' + chalk.cyan(`http://localhost:${PORT}`))
})
