import ReactLoading from 'react-loading'
import './LoadingOverlay.css'

/**
 *
 * Overlay to display spinner and stop the user from cancelling an action
 * Takes in text to render so the user knows what is going on
 *
 * @param {text} param0
 * @returns void
 */
export default function LoadingOverlay({ children }) {
    return (
        <dialog open className="loadingoverlay">
            <p>{children}</p>
            <ReactLoading type="spinningBubbles" color="#000" />
        </dialog>
    )
}
