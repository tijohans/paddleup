import React from 'react'
import { Link } from 'react-router-dom'
import './Button.css'

/* 
    Custom button component used instead of regular html buttons
    This allows us to keep a consistent style for all buttons on the page, and add custom activity to each button
*/
export default function Button({ link, maxwidth, children, disabled }) {
    // Function for wrapping the Button in a Link component, to link to another page.
    const LinkWrapper = (component) => {
        if (link) {
            return <Link to={link}>{component}</Link>
        } else {
            return component
        }
    }

    return LinkWrapper(
        <button style={maxwidth ? { maxWidth: maxwidth } : null} type="button" disabled={disabled}>
            {children}
        </button>
    )
}
