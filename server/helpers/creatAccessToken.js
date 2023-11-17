/**
 *
 * @param {string} sub
 * @param {string} role
 * @returns
 */
export const createAccessToken = (sub, role) => {
    const expiration = '15min'
    const tokenValue = jwt.sign({ sub: sub, role: role }, process.env.JWT_SECRET, {
        expiresIn: expiration
    })
    return 'Bearer ' + tokenValue
}
