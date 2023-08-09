import Button from '../components/Button/Button'
import { Link } from 'react-router-dom'
import useFetchPlayernumber from '../hooks/Players/useFetchPlayernumber'
import useFetchMatchnumber from '../hooks/Matches/useFetchMatchnumber'
import useFetchTopfive from '../hooks/Players/useFetchTopfive'
import ReactLoading from 'react-loading'

export default function LandingPage() {
    const { playerNumber, playerNumberLoading } = useFetchPlayernumber()
    const { matchNumber, matchNumberLoading } = useFetchMatchnumber()
    const { topFivePlayers, topFivePlayersLoading } = useFetchTopfive()

    return (
        <main>
            <section>
                <h1>Welcome to PaddleUp!</h1>
                <p>
                    PaddeUp is a dashboard for the table tennis league at NTNU Gjøvik. The place for
                    all your ping pong needs!
                </p>
                <p>
                    Here you can play matches against other users, compete in the leaderboard, watch
                    how your friends are doing, and more..
                </p>
                <p>
                    If you do not have a user registered yet, and want to participate in the league
                    - you can do this on the <Link to="/register">registration page</Link>!
                </p>
                <Button link="/login">Login</Button>
            </section>

            <article>
                <h2>Statistics</h2>

                {/* Displaying the number of players once done loading */}
                <h4>
                    Total registered users:{' '}
                    <span aria-busy={playerNumberLoading}>{playerNumber}</span>
                </h4>

                {/* Displaying the number of matches once done loading */}
                <h4>
                    Total matches played: <span aria-busy={matchNumberLoading}>{matchNumber}</span>
                </h4>

                <h4>Top 5 players:</h4>
                <div className="whole-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topFivePlayersLoading && <ReactLoading />}
                            {topFivePlayers &&
                                topFivePlayers.map((player, index) => (
                                    <tr key={index}>
                                        <td>{player.username}</td>
                                        <td>{player.points}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </article>
        </main>
    )
}
