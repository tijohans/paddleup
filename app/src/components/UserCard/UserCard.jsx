import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './UserCard.css'
import { AuthContext } from '../../context/AuthContext'
import jwt_decode from 'jwt-decode'
import useUserInfo from '../../hooks/useUserInfo'

export default function UserCard({ player }) {
    const navigate = useNavigate()
    const { userId } = useUserInfo()

    return (
        <article className="userspage" onClick={() => navigate('/users/' + player._id)}>
            <div>
                <img
                    className="profile"
                    src="/icons/stock_user.svg"
                    alt={player.username + "'s picture"}
                />
            </div>
            <div className="usertext">
                <h1>{player.username} </h1>

                {/* Displaying you next to the user that is logged in */}
                {userId === player._id ? <p id="profile-text">(you)</p> : null}

                <p>
                    <em>{player.name}</em>
                </p>
                <div className="stat-indiv">
                    <p>Matches won:</p>
                    <p>{player.matchesWon}</p>
                </div>
                <div className="stat-indiv">
                    <p>Current score: </p>
                    <p>{player.points}</p>
                </div>
            </div>
        </article>
    )
}
