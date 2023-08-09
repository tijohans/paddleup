import express from 'express'
import {
    getPlayers,
    getPlayer,
    getTop5Players,
    updatePlayer,
    generatePasswordPlayer,
    deletePlayer,
    getPlayerNumber,
    addBookmark,
    getBookmarks,
    removeBookmark
} from '../controllers/playerController.js'
import { verifyToken, verifyAdmin, verifyUser } from '../middleware/authMiddleware.js'

const playerRouter = express()

// Public routes
playerRouter.route('/playernumber').get(getPlayerNumber)
playerRouter.route('/top5players').get(getTop5Players)

// User & admin routes
playerRouter.route('/').get(verifyToken, getPlayers)

playerRouter
    .route('/:id')
    .get(verifyToken, getPlayer)
    .patch(verifyToken, verifyUser, updatePlayer)
    .delete(verifyToken, verifyAdmin, deletePlayer)

playerRouter.route('/generatePass/:id').post(verifyToken, verifyAdmin, generatePasswordPlayer)

playerRouter.get('/:id/bookmarks', verifyToken, getBookmarks)
playerRouter.post('/:id/addBookmark', verifyToken, addBookmark)
playerRouter.post('/:id/removeBookmark', verifyToken, removeBookmark)

export { playerRouter }
