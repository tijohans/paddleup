import { Player } from '../models/playerSchema.js'
import bcrypt from 'bcryptjs'
import { randomToken } from '../helpers/RandomToken.js'
import nodemailer from 'nodemailer'

/* 
    @route  GET /api/players
    @desc   get all players
*/
const getPlayers = async (req, res) => {
    try {
        const players = await Player.find()
            .select({ password: 0 })
            .sort({ points: -1 })
            .populate('points')
        res.status(200).json(players)
    } catch (err) {
        console.error(err)
        res.json(err)
    }
}

/*
  @route  /api/player/playernumber
  @desc  Route for getting the number of registered users
*/
const getPlayerNumber = async (req, res) => {
    try {
        const players = await Player.find()
        const playerNumber = players.length
        res.status(200).json({ playerNumber })
    } catch (err) {
        console.log(err)
        res.json(err)
    }
}

const getTop5Players = async (req, res) => {
    try {
        const players = await Player.find({})
            .select({ username: 1, points: 1 })

            .sort({ points: -1 })
            .limit(5)
            .populate('points')
        res.status(200).json(players)
    } catch (err) {
        console.error(err)
        res.json(err)
    }
}

/* 
    @route  GET /api/players/:id
    @desc   get a single player
*/
const getPlayer = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id)
        res.status(200).json(player)
    } catch (err) {
        res.status(400).json(err)
    }
}

/* 
    @route  PATCH /api/players/:id
    @desc   update a player
*/

const updatePlayer = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id)

        if (!player) {
            return res.status(404).json({ error: 'Player not found' })
        }

        // Update player information
        player.name = req.body.name
        player.username = req.body.username
        player.email = req.body.email
        player.department = req.body.department
        player.birthdate = req.body.birthdate
        player.points = req.body.points

        // Check if a new password is provided
        if (req.body.password) {
            // Hash the new password
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            player.password = hashedPassword
        }

        // Save the updated player
        const updatedPlayer = await player.save()

        res.status(200).json(updatedPlayer)
    } catch (err) {
        res.status(400).json(err)
    }
}

const generatePasswordPlayer = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id)

        if (!player) {
            return res.status(404).json({ error: 'Player not found' })
        }

        const newPassword = randomToken(8)

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        player.password = hashedPassword

        // Save the updated player
        const updatedPlayer = await player.save()

        // Send email to the user with the information
        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: 'paddleuphorton@outlook.com',
                pass: process.env.MAIL_PASS
            }
        })

        const mailOptions = {
            from: 'paddleuphorton@outlook.com',
            to: player.email,
            subject: 'PaddleUp - New Password',
            html: `
        <h1>PaddleUp</h1>
        <h3>You have recieved a new password</h3>
        <p>Your new password is ${newPassword}</p>
      `
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })

        res.status(200).json(updatedPlayer)
    } catch (err) {
        res.status(400).json(err)
    }
}

/* 
    @route  DELETE /api/players/:id
    @route  delete a player
*/
const deletePlayer = async (req, res) => {
    try {
        const deletedPlayer = await Player.findByIdAndDelete(req.params.id)
        res.status(200).json(deletedPlayer)
    } catch (err) {
        res.status(400).json(err)
    }
}

/*  
    @route  GET /api/players/:id/bookmarks
    @desc   Get all bookmarked players for a specific player
*/
const getBookmarks = async (req, res) => {
    const playerId = req.params.id

    try {
        const player = await Player.findById(playerId).populate('bookmarkedPlayers', '_id name')

        if (!player) {
            return res.status(400).json({ error: 'Bad request' })
        }

        const bookmarkedPlayerIds = player.bookmarkedPlayers

        // Fetch the bookmarked players using the player IDs
        const bookmarkedPlayers = await Player.find({ _id: { $in: bookmarkedPlayerIds } })

        return res.status(200).json(bookmarkedPlayers)
    } catch (error) {
        return res.json(error)
    }
}

/* 
    * Going outside the REST paradigm here to keep the url's concise, 
    * since we are manipulating what should probably be its own schema
    
    @route  POST /api/players/:id/addBookmark
    @desv   Route for adding a bookmark
*/
const addBookmark = async (req, res) => {
    const playerIdToBookmark = req.body.playerIdToBookmark
    const playerId = req.params.id

    // console.log(playerIdToBookmark)

    try {
        await Player.findByIdAndUpdate(
            playerId,
            { $addToSet: { bookmarkedPlayers: playerIdToBookmark } },
            { new: true } // specifying we want to return the updated player object
        ).exec()

        res.status(200).json({
            msg: 'Bookmarked player successfully',
            bookmarkedPlayer: playerIdToBookmark
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'An error occurred while updating the player.' })
    }
}

/* 
    @route  POST /api/players/:id/removeBookmark
    @desc   Remove a bookmark from a player based on the id of the user we which to unbookmark
*/
const removeBookmark = async (req, res) => {
    const playerId = req.params.id
    const playerIdToRemove = req.body.removeId

    try {
        await Player.findByIdAndUpdate(
            playerId,
            { $pull: { bookmarkedPlayers: playerIdToRemove } },
            { new: true } // specifying we want to return the updated player object
        ).exec()

        res.status(200).json({
            msg: 'Bookmarked player removed successfully',
            bookmarkedPlayer: playerIdToRemove
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'An error occurred while updating the player.' })
    }
}

export {
    getPlayers,
    getPlayer,
    getTop5Players,
    updatePlayer,
    generatePasswordPlayer,
    deletePlayer,
    getPlayerNumber,
    getBookmarks,
    addBookmark,
    removeBookmark
}
