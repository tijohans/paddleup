import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MatchCard from '../../components/MatchCard/MatchCard'
import LoadingOverlay from '../../utils/LoadingOverlay/LoadingOverlay'
import CreateMatchPopup from '../../components/CreateMatchPopup/CreateMatchPopup'
import useMatch from '../../hooks/Matches/useMatch'

function OneMatch() {
    const [matchStatus, setMatchStatus] = useState()
    const { id } = useParams()
    const { match, matchLoading } = useMatch(id)

    useEffect(() => {
        if (matchLoading) return

        getMatchStatus()
    }, [match])

    const getMatchStatus = () => {
        // Check if
        if (match) {
            setMatchStatus('showMatchResults')
        }

        /* 
            Checks is this match does not exist, if it does not, shows create/join match

            This also applies for matches that have in theory been created by another player,
            but that match is on standby in the temp db
        */
        if (!match) {
            setMatchStatus('showPopup')
        }
    }

    return (
        <main>
            {matchLoading && <LoadingOverlay />}
            {matchStatus === 'showPopup' && (
                <CreateMatchPopup
                    forceOpen={true}
                    text="This match does not exist, do you want to create/join one?"
                />
            )}
            {matchStatus && matchStatus === 'showMatchResults' && <MatchCard matchprop={match} />}
        </main>
    )
}

export default OneMatch
