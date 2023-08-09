import express from 'express'
import {
    loginUser,
    registerPlayer,
    refreshToken,
    logoutUser
} from '../controllers/authController.js'

const authRouter = express()
authRouter.post('/login', loginUser)
authRouter.post('/register', registerPlayer)
// Route to generate a new access token and a new refresh token
authRouter.post('/refresh', refreshToken)
authRouter.post('/logout', logoutUser)

export { authRouter }
