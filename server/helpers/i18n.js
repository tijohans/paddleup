const invalidRequest = 'Invalid request — '

export const i18n = {
    errors: {
        wrongCredentials: 'Email or password incorrect',
        notVerified: 'This email has not yet been verified',
        emailAlreadyRegistered: 'This email has already been registered',
        invalidRequest: {
            notFound: invalidRequest + 'nothing found',
            noToken: invalidRequest + 'no token',
            expiredToken: invalidRequest + 'expired token',
            badRequest: invalidRequest + 'bad request',
            noId: invalidRequest + 'no player id provided'
        },
        notFound: {
            match: 'Match not found'
        },
        room: {
            invalidId: 'Not a valid room ID',
            matchDoesNotExist: 'No match exists with that room ID',
            noJoin: 'Not able to join that match',
            inactive: 'Match is not active'
        },
        match: {
            noPlayer: 'No matches with that player',
            noActivePlayer: 'No active matches with that player',
            notComplete: 'Match not set as complete'
        }
    },
    success: {
        logout: 'You have successfullly been logged out'
    }
}
