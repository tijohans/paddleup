import './MatchCard.css'
import { formatDateString } from '../../utils/formatDateString'
import TableButton from '../TableButton/TableButton'
import { useNavigate, useParams } from 'react-router-dom'
import useUserInfo from '../../hooks/useUserInfo'
import useDeleteMatch from '../../hooks/Matches/useDeleteMatch'
import ReactLoading from 'react-loading'

/* 
    Function for rendering a match card in the match page
    Takes in a match object, with all data regarding the match
*/
export default function MatchCard({ matchprop }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const { userRole } = useUserInfo()
    const { deleteMatch, isMatchDeleted } = useDeleteMatch()

    const getScoreStyle = (score1, score2) => {
        if (score1 > score2) {
            return {
                fontWeight: 'bold',
                color: 'rgb(0, 178, 0)'
            }
        } else if (score2 > score1) {
            return {
                fontWeight: 'normal'
            }
        }
        return {}
    }

    return (
        <>
            {/* If loading is true we only show a spinner, else we render the content as it should be displayed */}
            {!matchprop ? (
                <ReactLoading />
            ) : isMatchDeleted ? (
                <article>
                    <p>This match has been deleted successfully</p>
                </article>
            ) : (
                <>
                    <article className="matchcard__article">
                        {/* <p className="matchcard__article__id">{matchprop._id}</p> */}
                        {/* <p className="matchcard__article__game-number">{gameNumber}</p> */}
                        <p className="matchcard__article__readableId">{matchprop.readableId}</p>

                        {/* Checking if p1, and p1.name exists in case of deleted users. If no id is found, use player 1 or player 2 */}
                        <div className="matchcard__article__players__container">
                            <div className="matchcard__article__player__container">
                                <img
                                    src="/icons/stock_user.svg"
                                    alt="user profile photo"
                                    className="matchcard__article__player__photo"
                                />
                                <p
                                    className={
                                        'matchcard__article__player matchcard__article__player--1'
                                    }
                                    style={getScoreStyle(
                                        matchprop.player1Score,
                                        matchprop.player2Score
                                    )}
                                >
                                    {matchprop?.players?.p1?.username || 'Player 1'}
                                </p>
                            </div>

                            <div className="matchcard__article__player__container__score">
                                <p className="matchcard__article__player__container__score">VS</p>
                                <p className="matchcard__article__results">
                                    {matchprop.matchResult}
                                </p>
                            </div>

                            <div className="matchcard__article__player__container">
                                <img
                                    src="/icons/stock_user.svg"
                                    alt="user profile photo"
                                    className="matchcard__article__player__photo"
                                />
                                <p
                                    className={
                                        'matchcard__article__player matchcard__article__player--2'
                                    }
                                    style={getScoreStyle(
                                        matchprop.player2Score,
                                        matchprop.player1Score
                                    )}
                                >
                                    {matchprop?.players?.p2?.username || 'Player 2'}
                                </p>
                            </div>
                        </div>

                        {/* Using the function formatDatString to show the date in a readable format */}
                        <p className="matchcard__article__date">
                            Played: {formatDateString(new Date(matchprop.date))}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '10%' }}>
                            {userRole === 'admin' && (
                                <>
                                    {' '}
                                    <TableButton
                                        variant={1}
                                        flat={true}
                                        onClick={() => {
                                            deleteMatch(matchprop._id)
                                        }}
                                    >
                                        Delete
                                    </TableButton>
                                    <TableButton link={`/matches/${matchprop._id}/edit`}>
                                        Edit
                                    </TableButton>
                                </>
                            )}

                            {id ? (
                                ''
                            ) : (
                                <TableButton
                                    variant={3}
                                    flat={true}
                                    onClick={() => {
                                        navigate(`/matches/${matchprop._id}`)
                                    }}
                                >
                                    View
                                </TableButton>
                            )}
                        </div>
                    </article>
                </>
            )}
        </>
    )
}

{
    /* <TableButton link={`/matches/${matchprop._id}/edit`}>
              Edit
            </TableButton>
            <TableButton
              variant={2}
              flat={true}
              onClick={() => {
                deleteMatch(matchprop._id);
              }}
            >
              Delete
            </TableButton> */
}
