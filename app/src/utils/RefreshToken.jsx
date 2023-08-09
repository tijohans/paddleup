import axios from 'axios'

async function RefreshToken() {
    const api = axios.create({
        baseURL: import.meta.env.VITE_BASE_API_URI,
        withCredentials: true
    })
    try {
        const res = await api.post('/api/refresh')
        // If refreshtoken matches,
        // split the token by the 'Bearer',
        const jwt = res.data.accessToken.split(' ')[1]
        // and get the username from the response∑
        // const username = res.data.username;

        // and set the new access token and username
        return jwt
    } catch (error) {
        // If error catched (refreshToken does not match any in the DB, for example),
        // log the error
        // ! This can happen often, so it is not logged anymore ?
        //console.error(error);
        // Set token to an empty string (to 'log out' - and prevent access to protected content)
        return null
    }
}

export default RefreshToken
