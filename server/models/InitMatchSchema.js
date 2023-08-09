import mongoose from 'mongoose'
import m2s from 'mongoose-to-swagger'

const initMatchesSchema = new mongoose.Schema({
    p1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    active: {
        type: Boolean
    },
    readableId: {
        type: Number
    }
})

const InitMatch = mongoose.model('InitMatch', initMatchesSchema)
const swaggerMatchesSchema = m2s(InitMatch)
export { InitMatch, swaggerMatchesSchema }
