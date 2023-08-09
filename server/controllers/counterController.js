import { CounterModel } from '../models/counterSchema.js'

const getNextReadableDocumentId = async () => {
    try {
        const counter = await CounterModel.findOneAndUpdate(
            { _id: 'counterId' },
            { $inc: { counter: 1 } },
            { new: true, upsert: true }
        )

        console.log(counter)
        return counter.counter
    } catch (error) {
        throw new Error({ msg: 'Error retrieving or updating id', error })
    }
}

export { getNextReadableDocumentId }
