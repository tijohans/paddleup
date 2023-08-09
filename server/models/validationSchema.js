import mongoose from 'mongoose'
import m2s from 'mongoose-to-swagger'

const validationSchema = new mongoose.Schema({
    playerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
        // required: true
    },
    token: {
        type: String
        // required: true
    }
})

const Validation = mongoose.model('Validation', validationSchema, 'validations')
const swaggerValidationSchema = m2s(Validation)
export { Validation, swaggerValidationSchema }
