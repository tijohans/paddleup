import mongoose from 'mongoose'

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    counter: { type: Number, default: 0 }
})

const CounterModel = mongoose.model('Counter', CounterSchema)

export { CounterModel }
