import useMatches from '../../hooks/Matches/useMatches'
import MatchCard from '../../components/MatchCard/MatchCard'
import Button from '../../components/Button/Button'
import usePlayer from '../../hooks/Players/usePlayer'
import useUserInfo from '../../hooks/useUserInfo'

export default function AdminMatches() {
    const { matches, loadingMatches } = useMatches()
    const { userId } = useUserInfo()
    const { player } = usePlayer(userId)

    return (
        <>
            <Button link="/creatematch">Create a new match</Button>
            <h1>All games</h1>
            {loadingMatches ? (
                <p aria-busy={loadingMatches}></p>
            ) : (
                matches &&
                matches.map((match) => (
                    <MatchCard key={match._id} matchprop={match} user={player} />
                ))
            )}
        </>
    )
}
