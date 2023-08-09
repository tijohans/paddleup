import { Match } from '../models/matchesSchema.js'
import { Player } from '../models/playerSchema.js'

const calculatePointUser = async (playerid) => {
    try {
        const matches = await Match.find()

        const playerMatches = matches.filter((match) => {
            const p1Id = match.players.p1.toString()
            const p2Id = match.players.p2.toString()
            return p1Id === playerid.toString() || p2Id === playerid.toString()
        })

        const matchesPlayed = playerMatches.length

        const matchesWon = matches.filter((match) => match.winner == playerid.toString())

        let totalPoints = 0
        // Get one point for each match played
        totalPoints += matchesPlayed

        // Add winner points (3), but only time by 2 as you already get a point for playing
        totalPoints += matchesWon.length * 2

        await Player.findOneAndUpdate({ _id: playerid.toString() }, { points: totalPoints })
        //console.log("Player updated with points: " + totalPoints)
    } catch (err) {
        console.error(err)
    }
}
export default calculatePointUser
