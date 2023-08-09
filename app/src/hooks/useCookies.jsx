import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

export default function useCookies(trigger) {
    const [cookiesAccepted, setCookiesAccepted] = useState(Cookies.get('CookieConsent'))
    const [cookieError, setCookieError] = useState()

    useEffect(() => {
        // Try to get cookie again
        setCookiesAccepted(Cookies.get('CookieConsent'))

        // If no cookie is present, set error message and return false
        if (!cookiesAccepted) {
            setCookieError('Error: Please enable cookies to log in and access our services.')
        }
    }, [trigger])

    return { cookiesAccepted, cookieError }
}
