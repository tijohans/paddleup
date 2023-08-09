import { useEffect } from 'react'
import UserCard from '../components/UserCard/UserCard'
import usePlayers from '../hooks/Players/usePlayers'
import useMatches from '../hooks/Matches/useMatches'
import ReactLoading from 'react-loading'

export default function AllUsers() {
    // const [users, setUsers] = useState([])
    // const [matches, setMatches] = useState([])
    let { players, playerLoading } = usePlayers()
    const { matches, loadingMatches } = useMatches()

    // useEffect to be run after matches has been retrieved
    useEffect(() => {
        // * Function to loop through all the users and matches, and see if their userid and the match's winner id matches.
        // If so, increment the user's matches won.
        if (!matches || !players) return

        players.forEach((player) => {
            const matchesWon = matches.filter((match) => match.winner === player._id)
            player.matchesWon = matchesWon.length
        })
    }, [matches, players])

    // Get all users and map to a <UserCard> component per user
    return (
        <main>
            {playerLoading || loadingMatches ? (
                <ReactLoading type="spinningBubbles" color="#4FA2ED" />
            ) : (
                players &&
                players
                    .filter((user) => user.role !== 'admin')
                    .map((user) => <UserCard key={user._id} player={user} />)
            )}
        </main>
    )
}
