import React from 'react'
import Button from '../Button/Button'

export default function Unauthorized() {
    return (
        <main>
            <h1>401 Unauthorized</h1>
            <p>You are not authorized to view this content.</p>
            <p>If this is a mistake please log in and try again.</p>
            <Button link="/login">Login</Button>
        </main>
    )
}
