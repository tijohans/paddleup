import { useContext, useState } from 'react'
import { alertConfirm } from '../../utils/confirmAlert'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'

export default function useDeleteMatch() {
    const { token } = useContext(AuthContext)
    const [isMatchDeleted, setIsMatchDeleted] = useState(false)

    const deleteMatch = (id) => {
        alertConfirm(
            'Delete match',
            'Are you sure you want to delete this match?',
            deleteMatchAction.bind(this, id)
        )
    }

    const deleteMatchAction = (id) => {
        axios
            .delete(`/api/matches/${id}`, {
                headers: { token }
            })
            .then((res) => {
                setIsMatchDeleted(true)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    return { deleteMatch, isMatchDeleted }
}
