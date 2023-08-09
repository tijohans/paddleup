import express from 'express'
import {
    getMatches,
    getMatchesNumber,
    createMatch,
    getMatch,
    deleteMatch,
    updateMatch,
    initMatch,
    completeMatch,
    checkIfMatchExist,
    checkMatchComplete,
    checkMatchActive,
    checkMatchUser,
    getMatchesPlayed
} from '../controllers/matchesController.js'
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js'

const matchesRouter = express()

matchesRouter
    .route('/')
    .get(verifyToken, verifyAdmin, getMatches)
    .post(verifyToken, verifyAdmin, createMatch)

matchesRouter.route('/matchnumber').get(getMatchesNumber)

matchesRouter.route('/played').get(verifyToken, getMatchesPlayed)
matchesRouter.route('/initmatch').post(verifyToken, initMatch)
matchesRouter.route('/completematch').post(verifyToken, completeMatch)
matchesRouter.route('/active/:roomid').get(verifyToken, checkMatchActive)
matchesRouter.route('/complete/:roomid').get(verifyToken, checkMatchComplete)
matchesRouter.route('/verify/:userid').get(verifyToken, checkMatchUser)
matchesRouter.route('/checkIfMatchExists').post(verifyToken, checkIfMatchExist)

matchesRouter
    .route('/:id')
    .get(verifyToken, getMatch)
    .delete(verifyToken, verifyAdmin, deleteMatch)
    .patch(verifyToken, verifyAdmin, updateMatch)

export { matchesRouter }
