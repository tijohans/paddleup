import mongoose from 'mongoose'
import m2s from 'mongoose-to-swagger'

const matchesSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    players: {
        p1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
            required: true
        },
        p2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
            required: true
        }
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    matchResult: {
        type: String,
        required: true
    },
    player1Score: {
        type: Number,
        required: [true, 'Please enter the score of player1']
    },
    player2Score: {
        type: Number,
        required: [true, 'Please enter the score of player2']
    },
    setResult: {
        type: [String]
        // required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    timestamps: {
        startTime: {
            type: Date,
            default: new Date()
        },
        endTime: {
            type: Date,
            default: new Date()
        }
    },
    duration: {
        type: Number
    },
    completed: {
        type: Boolean
    },
    active: {
        type: Boolean
    },
    readableId: {
        type: Number
    }
})

const Match = mongoose.model('Match', matchesSchema, 'matches')
const swaggerMatchesSchema = m2s(Match)
export { Match, swaggerMatchesSchema }
