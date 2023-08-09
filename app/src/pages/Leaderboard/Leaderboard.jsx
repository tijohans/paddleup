import { Link } from 'react-router-dom'
import './Leaderboard.css'
import usePlayers from '../../hooks/Players/usePlayers'
import usePlayerBookmarks from '../../hooks/Players/usePlayerBookmarks'
import LoadingOverlay from '../../utils/LoadingOverlay/LoadingOverlay'
import { useState } from 'react'

export default function Leaderboard() {
    const [trigger, setTrigger] = useState(false)
    const { players, playersLoading } = usePlayers(trigger)
    const { playerBookmarks, playerBookmarksLoading, removeBookmark, addBookmark } =
        usePlayerBookmarks(trigger)

    const handleCheckboxChange = async (playerId) => {
        const isBookmarked = playerBookmarks
            ? playerBookmarks.some((player) => player._id === playerId)
            : false

        if (isBookmarked) {
            removeBookmark(playerId)
        } else {
            addBookmark(playerId)
        }

        setTrigger(!trigger)
    }

    return (
        <div>
            <h1>Leaderboards</h1>
            <hr />
            {playersLoading || playerBookmarksLoading ? <LoadingOverlay /> : ''}

            {playerBookmarks && playerBookmarks.length > 0 && (
                <div>
                    <h2>Favorite Players</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playerBookmarks.map((player, index) => (
                                <tr key={index}>
                                    <td>
                                        <Link to={`/users/${player._id}`}>{player.username}</Link>
                                    </td>
                                    <td>{player.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <h2>All players</h2>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Points</th>
                        <th>Bookmark</th>
                    </tr>
                </thead>
                <tbody>
                    {players &&
                        players.map((player, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <Link to={`/users/${player._id}`}>{player.username}</Link>
                                </td>
                                <td>{player.points}</td>
                                <td>
                                    <input
                                        className="star"
                                        type="checkbox"
                                        checked={
                                            playerBookmarks &&
                                            playerBookmarks.some((i) => i._id === player._id)
                                        }
                                        onChange={() => handleCheckboxChange(player._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}
