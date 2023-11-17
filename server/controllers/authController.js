import 'dotenv/config'
import { Player } from '../models/playerSchema.js'
import { RefreshToken } from '../models/refreshTokenSchema.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { Validation } from '../models/validationSchema.js'
import { randomToken } from '../helpers/RandomToken.js'
import nodemailer from 'nodemailer'

/**
    @route  /api/login
    @desc   Route for logging in user
*/
const loginUser = async (req, res) => {
    // Find the email and password from the body in the request
    const { email, password } = req.body

    // Find user in the database based on the email
    const user = await Player.findOne({ email: email }).populate('username')

    if (!user)
        // If user does not exist, return an error
        return res.status(400).json({ error: 'Password or email incorrect' })

    // Compare the password gotten with the hashed password stored
    const correctPassword = await bcrypt.compare(password, user.password)

    // If the password does not match, return an error
    if (!user || !correctPassword)
        return res.status(400).json({ error: 'Password or email incorrect' })

    // (We use the same errors for the messages to not let the user know if an user exists or not, to prevent info to malicious attackers)

    // If the user is not validated, return an error
    if (!user.valid) return res.status(400).json({ error: 'Email not verified' })

    // Delete all old refresh tokens in the DB with the userid, to clear any old tokens.
    await RefreshToken.deleteMany({ playerid: user.id })

    // Genereate a random string for the refresh token using crypto
    const ranStr = crypto.randomBytes(64).toString('hex')

    // Create a refresh token with the userid, a random string (token) + an expiration date
    const refreshToken = new RefreshToken({
        playerid: user.id,
        token: ranStr,
        role: user.role,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })

    // Save the newly created refresh token to the database
    await refreshToken.save()

    // Create the access token, and set it to expire in 15 minutes
    const accessToken =
        'Bearer ' +
        jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' })

    // Return the refreshToken as a httpOnly cookie, and the accessToken in JSON format
    res.cookie('refreshToken', ranStr, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
    })
    return res.status(200).json({ accessToken, username: user.username })
}

/**
    @route  POST /api/register
    @desc   Register new player
*/
const registerPlayer = async (req, res) => {
    // First, check if the email already exists in the database, if so - throw an error
    const checkEmail = await Player.findOne({ email: req.body.email })
    if (checkEmail) return res.status(409).json({ err: 'Email already registered' })

    // Hash and salt the password using bcrypt
    const password = await bcrypt
        .genSalt(10)
        .then((salt) => {
            return bcrypt.hash(req.body.password, salt)
        })
        .catch((err) => console.error(err.message))

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

    // const savedValidation = await Validation.save();

    // Combine savedPlayer and savedValidation in a response object
    // const responseData = {
    //   savedPlayer,
    //   savedValidation,
    // };

    // res.status(200).json(savedPlayer);
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
        return res.status(400).json({ message: 'Invalid request - nothing found' })
    }

    if (req.cookies?.refreshToken) {
        // If we can find the refresh token cookie,
        // try to match it to a refreshtoken in the database
        const token = req.cookies?.refreshToken
        const refreshToken = await RefreshToken.findOne({ token })
        // If we can't find the refresh token, error
        if (!refreshToken)
            return res.status(400).json({ message: 'Invalid request - nothing toekn' })

        // If the refresh token is past it's expiration date, error
        if (refreshToken.expires < new Date(Date.now()))
            return res.status(400).json({ message: 'Invalid request - no token expired is' })

        // Get the playerid via the refresh token found in the database
        const { playerid, role } = refreshToken

        // Delete the old refresh token
        await RefreshToken.findByIdAndDelete(refreshToken._id)

        // Generate a new random string for the new refresh token to be generated
        const ranStr = crypto.randomBytes(64).toString('hex')

        // Create a new refresh token to replace the old one
        const newRefreshToken = new RefreshToken({
            playerid: playerid,
            token: ranStr,
            role: role,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })

        // Save the new refresh token in the database
        await newRefreshToken.save()

        // Generate a new access token for the user
        const accessToken =
            'Bearer ' +
            jwt.sign({ sub: playerid, role: role }, process.env.JWT_SECRET, { expiresIn: '15m' })

        // Return the refreshToken as a httpOnly cookie, and the accessToken in JSON format
        res.cookie('refreshToken', ranStr, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
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
            return res.status(400).json({ message: 'Invalid request (already logged out?)' })

        // Delete the old refresh token
        await RefreshToken.findByIdAndDelete(refreshToken._id)

        // Clear the HTTPOnly refreshToken for log out.
        res.clearCookie('refreshToken')
        return res.status(200).json({ message: 'Successful logout' })
    }
}

export { loginUser, registerPlayer, refreshToken, logoutUser }
