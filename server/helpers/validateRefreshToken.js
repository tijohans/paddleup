/**
 *
 * @param {string} refreshToken
 * @returns {boolean}
 */
export const validateRefreshToken = (refreshToken) => {
    if (!refreshToken) return false

    if (refreshToken.expires < new Date(Date.now())) return false

    return true
}
