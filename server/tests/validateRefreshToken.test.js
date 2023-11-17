import { validateRefreshToken } from '../helpers/validateRefreshToken'
import { test, expect } from 'jest'

test('returns false if refreshToken is null', () => {
    expect(validateRefreshToken(null)).toBe(false)
})

test('returns false if refreshToken has expired', () => {
    const expiredToken = { expires: new Date(Date.now() - 1000 * 60 * 60) }
    expect(validateRefreshToken(expiredToken)).toBe(false)
})

test('returns true if refreshToken is valid', () => {
    const validToken = { expires: new Date(Date.now() + 1000 * 60 * 60) }
    expect(validateRefreshToken(validToken)).toBe(true)
})
