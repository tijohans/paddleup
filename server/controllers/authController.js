import 'dotenv/config'
import { Player } from '../models/playerSchema.js'
import { RefreshToken } from '../models/refreshTokenSchema.js'
import crypto from 'crypto'
import { Validation } from '../models/validationSchema.js'
import { randomToken } from '../helpers/RandomToken.js'
import nodemailer from 'nodemailer'
import { generateRefreshToken } from '../helpers/genereateRefreshToken.js'
import { i18n } from '../helpers/i18n.js'
import { createAccessToken } from '../helpers/creatAccessToken.js'
import { timeValues } from '../helpers/timeValues.js'
import { hashPassword, validatePassword } from '../helpers/password.js'

/**
    @route  /api/login
    @desc   Route for logging in user
*/
const loginUser = async (req, res) => {
    const { email, password } = req.body

    const user = await Player.findOne({ email: email }).populate('username')

    if (!user) return res.status(400).json({ error: i18n.errors.wrongCredentials })

    const isCorrectPassword = validatePassword(password, user.password)

    if (!isCorrectPassword) return res.status(400).json({ error: i18n.errors.wrongCredentials })
    if (!user.valid) return res.status(400).json({ error: i18n.errors.notVerified })

    await RefreshToken.deleteMany({ playerid: user.id })

    const randomString = crypto.randomBytes(64).toString('hex')

    await generateRefreshToken(user.id, randomString, user.role)
    const accessToken = createAccessToken(user.id, user.role)

    res.cookie('refreshToken', randomString, {
        httpOnly: true,
        secure: true,
        maxAge: timeValues.millisecondsInADay
    })

    return res.status(200).json({ accessToken, username: user.username })
}

/**
    @route  POST /api/register
    @desc   Register new player
*/
const registerPlayer = async (req, res) => {
    const checkEmail = await Player.findOne({ email: req.body.email })

    if (checkEmail) return res.status(409).json({ err: i18n.errors.emailAlreadyRegistered })

    const password = hashPassword(req.body.password)

    // Retrieve the information needed for player creation in the body
    // Create a new MongoDB schema object with this information
    const player = new Player({
        name: req.body.name,
        username: req.body.username,
        password: password,
        email: req.body.email,
        department: req.body.department,
        role: 'player'
    })

    // Optional inputs
    if (req.body.birthdate) player.birthdate = req.body.birthdate
    if (req.body.points) player.points = req.body.points
    if (req.body.valid) player.valid = req.body.valid

    // Save the information in the database
    try {
        const savedPlayer = await player.save()
        res.send(savedPlayer)
    } catch (err) {
        console.errpr('saveplayer', err)
    }

    // let testAccount = await nodemailer.createTestAccount();

    let token = randomToken(16)
    const confirmationLink = `http://localhost:5173/emailValidation/${token}`

    let id = player._id.toString()

    const validation = new Validation({
        playerid: id,
        token: token
    })

    try {
        validation.save()
    } catch (error) {
        console.error('saveval', error)
    }

    // Send email to the user with the information
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        //   port: 587,
        //   secure: false,
        auth: {
            user: 'paddleuphorton@outlook.com',
            pass: process.env.MAIL_PASS
        }
    })

    const mailOptions = {
        from: 'paddleuphorton@outlook.com',
        to: req.body.email,
        subject: 'Welcome to PaddleUp!',
        html: `
      <h1>Welcome to PaddleUp, ${req.body.name}!</h1>
      <p>Please click the button below to confirm your email address:</p>
      <a href="${confirmationLink}">Confirm Email</a>
    `
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}

/** 
    @route  /api/refresh
    @desc   Route for refreshing the tokens
*/
const refreshToken = async (req, res) => {
    // Inspiration and some source come from this tutorial:
    // https://jasonwatmore.com/post/2020/06/17/nodejs-mongodb-api-jwt-authentication-with-refresh-tokens

    // Check if a cookie named refreshToken exists

    if (!req.cookies?.refreshToken) {
        // If not, return error
        return res.status(400).json({ message: i18n.errors.invalidRequest.notFound })
    }

    if (!req.cookies?.refreshToken) {
        // If we can find the refresh token cookie,
        // try to match it to a refreshtoken in the database
        const token = req.cookies?.refreshToken
        const refreshToken = await RefreshToken.findOne({ token })
        // If we can't find the refresh token, error
        if (!refreshToken)
            return res.status(400).json({ message: i18n.errors.invalidRequest.noToken })

        // If the refresh token is past it's expiration date, error
        if (refreshToken.expires < new Date(Date.now()))
            return res.status(400).json({ message: i18n.errors.invalidRequest.expiredToken })

        // Get the playerid via the refresh token found in the database
        const { playerid, role } = refreshToken

        // Delete the old refresh token
        await RefreshToken.findByIdAndDelete(refreshToken._id)

        // Generate a new random string for the new refresh token to be generated
        const ranStr = crypto.randomBytes(64).toString('hex')

        await generateRefreshToken(playerid, ranStr, role)

        const accessToken = createAccessToken(playerid, role)

        // Return the refreshToken as a httpOnly cookie, and the accessToken in JSON format
        res.cookie('refreshToken', ranStr, {
            httpOnly: true,
            secure: true,
            maxAge: timeValues.millisecondsInADay
        })
        return res.status(200).json({ accessToken })
    }
}

/** 
    @route  /api/logout
    @desc   Route for logging out
*/
const logoutUser = async (req, res) => {
    if (req.cookies?.refreshToken) {
        // If we can find the refresh token cookie,
        // try to match it to a refreshtoken in the database
        const token = req.cookies?.refreshToken
        const refreshToken = await RefreshToken.findOne({ token })
        // If we can't find the refresh token, error
        if (!refreshToken)
            return res.status(400).json({ message: i18n.errors.invalidRequest.badRequest })

        // Delete the old refresh token
        await RefreshToken.findByIdAndDelete(refreshToken._id)

        // Clear the HTTPOnly refreshToken for log out.
        res.clearCookie('refreshToken')
        return res.status(200).json({ message: i18n.success.logout })
    }
}

export { loginUser, registerPlayer, refreshToken, logoutUser }
