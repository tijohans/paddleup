import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './TableButton.css'

export default function TableButton({ children, onClick, link, disabled }) {
    const [color, setColor] = useState('')
    const navigate = useNavigate()

    // Function for navigating to another page if the button is not disabled
    const linkFunc = () => {
        if (!disabled) {
            navigate(link)
        }
    }

    return (
        <button onClick={onClick ? onClick : linkFunc} className="tableButton">
            {children}
        </button>
    )
}
