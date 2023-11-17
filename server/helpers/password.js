import bcrypt from 'bcryptjs'

/**
 *
 * @param {string} password
 */
export const hashPassword = (password) => {
    bcrypt
        .genSalt(10)
        .then((salt) => {
            return bcrypt.hash(password, salt)
        })
        .catch((err) => console.error(err.message))
}

/**
 *
 * @param {string} inputPassword
 * @param {string} userPassword
 */
export const validatePassword = async (inputPassword, userPassword) =>
    await bcrypt.compare(inputPassword, userPassword)
