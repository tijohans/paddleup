import { toast } from 'react-toastify'

export const showNotification = (message, type, time) => {
    toast(message, {
        type: type,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        position: 'top-left',
        autoClose: time,
        draggable: true,
        progress: undefined
    })
}
