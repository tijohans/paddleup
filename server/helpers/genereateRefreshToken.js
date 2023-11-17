import { RefreshToken } from '../models/refreshTokenSchema'

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
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })

    try {
        await token.save()
    } catch (error) {
        console.error(error)
    }
}
