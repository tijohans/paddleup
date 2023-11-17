import { RefreshToken } from '../models/refreshTokenSchema'
import { timeValues } from './timeValues'

/**
 * Function for generating refresh token
 *
 * @param {string} userId
 * @param {string} token
 * @param {string} role
 * @returns
 */
export const generateRefreshToken = async (userId, randomString, role) => {
    const token = new RefreshToken({
        playerid: userId,
        token: randomString,
        role: role,
        expires: new Date(Date.now() + timeValues.millisecondsInAWeek)
    })

    try {
        await token.save()
    } catch (error) {
        console.error(error)
    }
}
