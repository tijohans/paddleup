import { Link } from 'react-router-dom'
import usePlayerBookmarks from '../../hooks/Players/usePlayerBookmarks'
import ReactLoading from 'react-loading'

export default function BookmarksPage() {
    const { playerBookmarks, playerBookmarksLoading } = usePlayerBookmarks()

    return (
        <section>
            <h1>Friends Leaderboard:</h1>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {playerBookmarksLoading && <ReactLoading type="spinningBubbles" color="#000" />}
                    {playerBookmarks &&
                        playerBookmarks.map((player, index) => (
                            <tr key={index}>
                                <td>
                                    <Link to={`/users/${player._id}`}>{player.username}</Link>
                                </td>
                                <td>{player.points}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </section>
    )
}
