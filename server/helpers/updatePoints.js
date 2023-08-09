import { Player } from '../models/playerSchema.js'

const updatePoints = async (p1id, p2id, winner) => {
    const players = [p1id.toString(), p2id.toString()]
    const winnerString = winner.toString()

    const winnerPointsIncrement = 2
    const loserPointsDecrement = 2

    //if winner is not the same as the initial match, give that player 2 points
    //if winner is the same as the initial match, nothing changes
    const winnerUpdate = Player.findByIdAndUpdate(winnerString, {
        $inc: { points: winnerPointsIncrement }
    })

    //if loser is not the same as the initial match, remove 2 points
    //if loser is the same as the initial match, nothing changes
    const loserUpdate = Player.findOneAndUpdate(
        { _id: { $in: players.filter((player) => player !== winnerString) } },
        { $inc: { points: -loserPointsDecrement } }
    )

    await Promise.all([winnerUpdate, loserUpdate])
}

export default updatePoints
