import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { showNotification } from '../utils/showNotification'
import { alertConfirm } from '../utils/confirmAlert'

export default function useGeneratePassword() {
    const { token } = useContext(AuthContext)

    const generatePassword = async (id, name) => {
        alertConfirm(
            'Generate Password',
            'Are you sure you want to generate a random password for ' +
                name +
                '? \n This will be sent to the user by email.',
            generatePasswordAction.bind(this, id)
        )
    }

    const generatePasswordAction = async (id) => {
        await axios
            .post(`/api/players/generatePass/${id}`, {
                headers: { token }
            })
            .then((res) => {
                showNotification('Password generated', 'success', 3000)
            })
            .catch((error) => {
                console.error(error)
                showNotification('Could not generate password', 'error', 3000)
            })
    }

    return { generatePassword }
}
