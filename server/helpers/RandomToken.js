function randomToken(length) {
    const characters = 'ABCDEFGHJLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789'
    let result = ''

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        result += characters.charAt(randomIndex)
    }

    return result
}

export { randomToken }
