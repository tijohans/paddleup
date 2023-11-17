import { Player } from '../models/playerSchema.js'

/**
 *
 * @param {string} email
 * @returns {boolean}
 */
export const checkIfUserExists = async (email) => {
    const player = await Player.findOne({ email: email })
    return player ? true : false
}
