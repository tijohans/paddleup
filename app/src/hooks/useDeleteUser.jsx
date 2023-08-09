import axios from 'axios'
import { showNotification } from '../utils/showNotification'
import { alertConfirm } from '../utils/confirmAlert'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function useDeleteUser() {
    const { token } = useContext(AuthContext)
    const [deletedUser, setDeletedUser] = useState()

    //bind to use in alertConfirm function with the id argument
    const deleteUser = async (id, name) => {
        alertConfirm(
            'Delete user',
            'Are you sure you want to delete ' + name + '? This cannot be undone.',
            deleteUserAction.bind(this, id)
        )
    }

    const deleteUserAction = async (id) => {
        await axios
            .delete(`/api/players/${id}`, {
                headers: { token }
            })
            .then((res) => {
                showNotification(`User with id: ${id} deleted successfully`, 'success', 3000)
                setDeletedUser(id)
            })
            .catch((error) => {
                console.error(error)
                showNotification('Could not delete user', 'error', 3000)
            })
    }

    return { deleteUser, deletedUser }
}
