import jwt from 'jsonwebtoken'
import 'dotenv/config'

const verifyToken = (req, res, next) => {
    const errorMessage = { error: 'Not authorized to access this content' }

    // Checking for the JWT in either the body or the headers
    const token = req.body.token || req.headers.token

    // ! console.log(token)

    // If no token is present return error
    if (!token) return res.status(401).json(errorMessage)

    try {
        // Decode the token and verify it
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.verified = decoded
        next()
    } catch (err) {
        return res.status(401).json(errorMessage)
    }
}

const verifyAdmin = (req, res, next) => {
    const errorMessage = { error: 'User is not authorized to access this content' }

    // Checking for the JWT in either the body or the headers
    const token = req.body.token || req.headers.token

    // If no token is present return error
    if (!token) return res.status(401).json(errorMessage)

    try {
        // Decode the token and verify it's role
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded.role !== 'admin') {
            return res.status(403).json(errorMessage)
        }

        req.verified = decoded
        next()
    } catch (err) {
        return res.status(403).json(errorMessage)
    }
}

const verifyUser = (req, res, next) => {
    const errorMessage = { error: 'User is not authorized to access this content' }

    // Checking for the JWT in either the body or the headers
    const token = req.body.token || req.headers.token

    // If no token is present return error
    if (!token) return res.status(401).json(errorMessage)

    try {
        // Decode the token and verify it's role
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded.role !== 'admin' && decoded.sub !== req.params.id) {
            return res.status(403).json(errorMessage)
        }

        req.verified = decoded
        next()
    } catch (err) {
        return res.status(403).json(errorMessage)
    }
}

export { verifyToken, verifyAdmin, verifyUser }
