import { Validation } from '../models/validationSchema.js'
import { Player } from '../models/playerSchema.js'

const validateToken = async (req, res) => {
    try {
        const { token } = req.body
        console.log(token)
        const validated = await Validation.findOne({ token })
        if (!validated) {
            return res.status(400).json({ error: 'Token not found' })
        }

        const player = await Player.findById(validated.playerid)

        // Update the player's registration status or perform any other required actions
        player.valid = true
        await player.save()

        console.log(validated)
        // Delete the token from the database
        await Validation.findOneAndDelete({ token })

        return res.status(200).json({ message: 'Token found' })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export { validateToken }
