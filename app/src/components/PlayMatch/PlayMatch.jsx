import { useParams } from 'react-router-dom'
import TableTennisWrapper from './TableTennisWrapper'
import './PlayMatch.css'
import usePlayer from '../../hooks/Players/usePlayer'
import useValidateMatch from '../../hooks/Matches/useValidateMatch'
import ReactLoading from 'react-loading'
import useUserInfo from '../../hooks/useUserInfo'

export default function PlayMatch() {
    const { userId } = useUserInfo()
    const { player, playerLoading } = usePlayer(userId)
    const { matchIsValidLoading } = useValidateMatch()
    const { roomid } = useParams()

    if (matchIsValidLoading || playerLoading || !player) {
        return <ReactLoading type="spinningBubbles" color="#000" />
    }

    return (
        <>
            <div className="ingame_center">
                <h1>Match ID: {roomid}</h1>
            </div>
            <TableTennisWrapper player={player} roomid={roomid} />
        </>
    )
}
