import mongoose from 'mongoose'
import m2s from 'mongoose-to-swagger'

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 10
    },
    email: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birthdate: Date,
    points: {
        type: Number,
        default: 0
    },
    bookmarkedPlayers: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player'
            }
        ]
    },
    role: {
        type: String,
        default: 'player'
    },
    valid: {
        type: Boolean,
        default: false
    }

    // eventsAttended: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
})

// Omit password for the schema shown in Swagger as the password does not get returned.
const options = {
    omitFields: ['password']
}

const Player = mongoose.model('Player', playerSchema, 'players')
const swaggerPlayerSchema = m2s(Player, options)

export { Player, swaggerPlayerSchema }
