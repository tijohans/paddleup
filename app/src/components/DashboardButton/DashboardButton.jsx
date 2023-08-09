import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './DashboardButton.css'
import { getColorVariant } from '../../utils/getColorVariant'

/*  
    ? Component for the buttons on the dashboard
    * Props:
    children -> Text to render
    link -> Link to redirect to when clicked
    onClick -> Sets the buttons onClick function. Will replace link.
    variant -> (1-5) Color variant, if left blank will result in a grey color
    icon -> (link) Icon to render to the left of the button (preferably SVG)
    disabled  -> (true/false) Sets the button disabled state.
*/
export default function DashboardButton({
    children,
    link,
    onClick,
    variant,
    icon,
    disabled,
    size
}) {
    const [color, setColor] = useState('')
    const [height, setHeight] = useState('127px')
    const navigate = useNavigate()

    // Function for navigating to another page if the button is not disabled
    const linkFunc = () => {
        if (!disabled) {
            navigate(link)
        }
    }

    useEffect(() => {
        setColor(getColorVariant(variant))

        if (size === 'large') {
            setHeight('254px')
        }
    }, [])

    return (
        <div className="dashboard-button-container">
            <div
                onClick={onClick ? onClick : linkFunc}
                className={disabled ? 'dashboard-button' : 'dashboard-button dashboard-active'}
                style={{
                    backgroundColor: color,
                    height: height,
                    justifyContent: icon ? 'space-between' : 'center'
                }}
            >
                {' '}
                {icon ? <img src={icon} alt={children + ' Icon'} /> : null}
                {disabled ? <p id="disabled">?</p> : <p>{children}</p>}
            </div>
        </div>
    )
}
