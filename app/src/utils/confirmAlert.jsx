import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

export const alertConfirm = (title, message, funcYes) => {
    const options = {
        title: title,
        message: message,
        buttons: [
            {
                label: 'Yes',
                onClick: funcYes
            },
            {
                label: 'No'
            }
        ],
        closeOnEscape: true,
        closeOnClickOutside: true,
        keyCodeForClose: [8, 32],
        willUnmount: () => {},
        afterClose: () => {},
        onClickOutside: () => {},
        onKeypress: () => {},
        onKeypressEscape: () => {},
        overlayClassName: 'overlay-custom-class-name'
    }
    confirmAlert(options)
}
