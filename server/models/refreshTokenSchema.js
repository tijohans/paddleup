import mongoose from 'mongoose'
import m2s from 'mongoose-to-swagger'

const refreshTokenSchema = new mongoose.Schema({
    playerid: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    role: {
        type: String
        // ! required: true
        // TODO: Not required for now, should probably be at delivery
    },
    expires: {
        type: Date,
        required: true
    }
})

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema, 'reftoks')
const swaggerRefreshTokenSchema = m2s(RefreshToken)

export { RefreshToken, swaggerRefreshTokenSchema }
