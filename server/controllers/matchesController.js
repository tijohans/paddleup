import { Match } from '../models/matchesSchema.js'
import { getNextReadableDocumentId } from './counterController.js'
import { InitMatch } from '../models/initMatchSchema.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import calculatePointUser from '../helpers/CalculatePoints.js'
import { i18n } from '../helpers/i18n.js'

/***
    @route  GET /api/matches
    @desc   get all matches
*/
const getMatches = async (req, res) => {
    try {
        const matches = await Match.find()
            // .sort({ _id: -1 })
            .sort({ _id: -1 })
            .populate('players.p1', 'username')
            .populate('players.p2', 'username')
        res.status(200).json(matches)
    } catch (err) {
        res.status(400).json(err)
    }
}

const getMatchesNumber = async (req, res) => {
    try {
        const matches = await Match.find()
        const matchNumber = matches.length
        res.status(200).json({ matchNumber })
    } catch (err) {
        console.log(err)
        res.json(err)
    }
}

/***
    @route  POST /api/matches
    @desc   Create a new match
*/
const createMatch = async (req, res) => {
    const readableId = await getNextReadableDocumentId()
    console.log(readableId)

    // Setting all required parameters
    const match = new Match({
        _id: readableId,
        players: {
            p1: req.body.p1,
            p2: req.body.p2
        },
        winner: req.body.winner,
        matchResult: req.body.matchResult,
        player1Score: req.body.player1Score,
        player2Score: req.body.player2Score,
        setResult: req.body.setResult,
        readableId: Number(readableId)
    })

    // checking for optional parameters
    if (req.body.timestamps) match.timestamps = req.body.timestamps
    if (req.body.date) match.date = req.body.date
    if (req.body.duration) match.duration = req.body.duration

    // Saving the match to the database
    try {
        const savedMatch = await match.save()

        // Using helper function
        await calculatePointUser(req.body.p1)
        await calculatePointUser(req.body.p2)
        res.status(200).json(savedMatch)
    } catch (err) {
        res.status(400).json(err)
    }
}

/***
    @route  GET /api/matches/:id
    @desc   Get a single match
*/
const getMatch = async (req, res) => {
    try {
        console.log(req.params.id)
        const match = await Match.findById(req.params.id)
            .sort({ date: -1 })
            .populate('players.p1', 'username')
            .populate('players.p2', 'username')

        res.status(200).json(match)
    } catch (err) {
        res.status(400).json(err)
    }
}

const updateMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id).sort({ date: -1 })
        if (!match) return res.status(404).json({ message: i18n.errors.notFound.match })

        // Update match information
        match.players.p1 = req.body.p1
        match.players.p2 = req.body.p2
        match.winner = req.body.winner
        match.matchResult = req.body.matchResult
        match.player1Score = req.body.player1Score
        match.player2Score = req.body.player2Score
        match.setResult = req.body.setResult
        match.timestamps = req.body.timestamps
        match.date = req.body.date
        match.duration = req.body.duration

        await calculatePointUser(match.players.p1)
        await calculatePointUser(match.players.p2)

        // Save the updated match
        const updatedMatch = await match.save()

        res.status(200).json(updatedMatch)
    } catch (err) {
        res.status(400).json(err)
    }
}

/*** 
    @route  DELETE /api/matches/:id
    @desc   delete a match
*/
const deleteMatch = async (req, res) => {
    try {
        const id = req.params.id
        // Finding the match to delete
        const playedMatch = await Match.findById(id)

        if (!playedMatch) return res.status(404).json({ message: i18n.errors.notFound.match })

        // Deleting the match
        const deletedMatch = await Match.findByIdAndDelete(id)

        // Decrementing the points for the players who played that match
        await calculatePointUser(playedMatch.players.p1)
        await calculatePointUser(playedMatch.players.p2)

        res.status(200).json(deletedMatch)
    } catch (err) {
        res.status(400).json(err)
    }
}

/***
    @route POST /api/matches/initmatch
    @description  Route for initializing a match
*/
const initMatch = async (req, res) => {
    //console.log(req);

    //generate readable id (room number)
    const readableId = await getNextReadableDocumentId()

    // Setting all required parameters
    const match = new InitMatch({
        p1: req.body.p1,
        readableId: Number(readableId),
        active: true
    })

    await match.save()

    // Saving the match to the database
    try {
        res.status(200).json({ readableId })
    } catch (err) {
        res.status(400).json(err)
    }
}

/***
 * @route POST /api/matches/completematch
 * @description route for completing a match once it is finishsed
 */
const completeMatch = async (req, res) => {
    // Saving the match to the database

    try {
        // Set match to not be active in the initmatch collection
        await InitMatch.findOneAndUpdate(
            { readableId: req.body.readableId },
            {
                active: false
            }
        )
    } catch (err) {
        console.warn(err)
    }

    try {
        const match = await Match.findOneAndUpdate(
            { _id: req.body.readableId },
            {
                players: {
                    p1: req.body.p1,
                    p2: req.body.p2
                },
                winner: req.body.winner,
                matchResult: req.body.matchResult,
                player1Score: req.body.player1Score,
                player2Score: req.body.player2Score,
                setResult: req.body.setResult,
                readableId: req.body.readableId,
                completed: true,
                active: false
            },
            { new: true, upsert: true }
        )

        // Using a helper function
        await calculatePointUser(req.body.p1)
        await calculatePointUser(req.body.p2)
        res.status(200).json(match)
    } catch (err) {
        res.status(400).json(err)
    }
}

/***
 * @description Route for checking if a match exists by passing the roomnumber in request
 * @route POST /api/matches/checkIfMatchExists
 * @param {Request} req
 * @param {Response} res
 * @returns {Boolean}
 */
const checkIfMatchExist = async (req, res) => {
    const roomId = req.body.roomId

    if (!roomId || !Number(roomId))
        return res.status(400).json({ error: i18n.errors.room.invalidId })

    const matchWithId = await Match.find({ readableId: roomId }).select()

    console.log(matchWithId)

    if (matchWithId.length === 0)
        return res.status(400).json({ error: i18n.errors.room.matchDoesNotExist })

    if (matchWithId.active !== true && matchWithId.completed !== false)
        return res.status(500).json({ error: i18n.errors.room.noJoin })

    // Returning a boolean value
    return res.status(200).json({ isActive: Boolean(matchWithId) })
}

const checkMatchActive = async (req, res) => {
    const roomid = req.params.roomid

    if (!roomid || !Number(roomid))
        return res.status(400).json({ error: i18n.errors.room.invalidId })

    const match = await InitMatch.findOne({ readableId: roomid })

    if (!match)
        return res.status(400).json({
            error: i18n.errors.room.matchDoesNotExist,
            active: false,
            found: false
        })

    if (!match.active) {
        return res
            .status(400)
            .json({ error: i18n.errors.room.inactive, active: false, found: true })
    }

    // Returning a boolean value
    return res.status(200).json({ active: true, found: true })
}

/***
 * @description Route for verifying that a user has not already got an active match with their id connected to
 * @route GET /api/matches/verify/:userid
 * @param {Request} req
 * @param {Response} res
 * @returns {Boolean}
 */
const checkMatchUser = async (req, res) => {
    const userid = req.params.userid

    if (!userid) return res.status(400).json({ error: i18n.errors.invalidRequest.noId })

    const match = await InitMatch.findOne({ p1: userid, active: true })

    if (!match) return res.status(200).json({ hasMatch: false, error: i18n.errors.match.noPlayer })

    if (!match.active)
        return res.status(200).json({ hasMatch: false, error: i18n.errors.match.noActivePlayer })

    if (match.active) return res.status(200).json({ hasMatch: true, roomid: match.readableId })
}

/***
 * @description Route for checking if a match has already been completed
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const checkMatchComplete = async (req, res) => {
    const roomid = req.params.roomid

    if (!roomid || !Number(roomid))
        return res.status(400).json({ error: i18n.errors.room.invalidId })

    const match = await Match.findOne({ readableId: roomid })

    console.log(match)

    if (!match) return res.status(400).json({ error: i18n.errors.notFound.match, complete: false })

    if (!match.completed)
        return res.status(400).json({ error: i18n.errors.match.notComplete, complete: false })

    return res.status(200).json({ complete: true })
}

/***
 *
 * @param {Request} req
 * @param {Response} res
 */
const getMatchesPlayed = async (req, res) => {
    const { token } = req.headers
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.sub

    try {
        const matches = await Match.find()
            .sort({ _id: -1 })
            .populate('players.p1', 'username')
            .populate('players.p2', 'username')

        const playedMatches = matches.filter((match) => {
            const p1Id = match.players.p1._id.toString()
            const p2Id = match.players.p2._id.toString()
            return p1Id === userId || p2Id === userId
        })

        res.status(200).json(playedMatches)
    } catch (err) {
        res.status(400).json(err)
    }
}

export {
    getMatches,
    getMatchesNumber,
    createMatch,
    getMatch,
    updateMatch,
    deleteMatch,
    initMatch,
    completeMatch,
    checkIfMatchExist,
    checkMatchActive,
    checkMatchComplete,
    checkMatchUser,
    getMatchesPlayed
}
