import MatchCard from '../../components/MatchCard/MatchCard'
import useUserInfo from '../../hooks/useUserInfo'
import usePlayer from '../../hooks/Players/usePlayer'
import ReactLoading from 'react-loading'
import usePlayedMatches from '../../hooks/Matches/usePlayedMatches'
import AdminMatches from '../../components/AdminMatches/AdminMatches'

export default function MatchesPage() {
    const { playedMatches, playedMatchesLoading } = usePlayedMatches()
    const { userRole, userId } = useUserInfo()
    const { player } = usePlayer(userId)

    return (
        <>
            {userRole && userRole === 'admin' ? (
                <AdminMatches />
            ) : (
                <div>
                    <h1>Your games</h1>
                    {playedMatchesLoading ? (
                        <ReactLoading type="spinningBubbles" color="#000" />
                    ) : (
                        <>
                            {playedMatches &&
                            playedMatches.filter(
                                (match) =>
                                    match.players &&
                                    (match.players.p1?.username === player.username ||
                                        match.players.p2?.username === player.username)
                            ).length < 1 ? (
                                <p>You have no games</p>
                            ) : (
                                playedMatches &&
                                playedMatches
                                    .filter(
                                        (match) =>
                                            match.players &&
                                            (match.players.p1?.username === player.username ||
                                                match.players.p2?.username === player.username)
                                    )
                                    .map((match) => (
                                        <MatchCard
                                            key={match._id}
                                            matchprop={match}
                                            user={player}
                                        />
                                    ))
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    )
}
