import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './UserPage.css'
import Button from '../../components/Button/Button'
import useUserInfo from '../../hooks/useUserInfo'
import usePlayer from '../../hooks/Players/usePlayer'
import usePlayedMatches from '../../hooks/Matches/usePlayedMatches'

export default function UserPage() {
    const navigate = useNavigate()

    let { id } = useParams()
    const { player, playerLoading } = usePlayer(id)
    const { userRole, userId } = useUserInfo()
    const { playedMatches, playedMatchesLoading } = usePlayedMatches()
    const [matchesWon, setMatchesWon] = useState(0)

    useEffect(() => {
        // Returing if matches does not exist
        if (!playedMatches || playedMatches.length < 1) return

        setMatchesWon(calculateMatchesWon())
    }, [playedMatches])

    const calculateMatchesWon = () => {
        return playedMatches.filter((match) => match.winner === id).length
    }

    return (
        <main className="userpage">
            {/* If the user is logged in to admin they should not have access to the user page (?) */}
            {userRole === 'admin' &&
                player &&
                userId === player._id &&
                navigate('/unauthorized', { replace: true })}

            {playerLoading || playedMatchesLoading ? (
                <p aria-busy={playerLoading}></p>
            ) : (
                <>
                    <section className="userarea">
                        <img
                            className="profile"
                            src="/icons/stock_user.svg"
                            alt={'User picture of ' + player.username}
                        />
                        <h1>{player.name}</h1>
                        {userId === id && <p id="profile-text">(you)</p>}
                        <p>Username: {player.username}</p>
                    </section>

                    <article className="stats">
                        <div className="stat-indiv">
                            <h2>STATS</h2>
                            <div id="line"></div>
                        </div>

                        <div className="stat-container">
                            <div className="stat-indiv">
                                <p>Matches won:</p>
                                <p>{matchesWon}</p>
                            </div>
                            <div className="stat-indiv">
                                <p>Score:</p>
                                <p>{player.points}</p>
                            </div>
                        </div>
                    </article>

                    {userId === id && (
                        <section className="userarea">
                            <Button link={`/users/${id}/edit`}>Edit profile</Button>
                            <Button link="/logout">Log out</Button>
                        </section>
                    )}
                </>
            )}
        </main>
    )
}
