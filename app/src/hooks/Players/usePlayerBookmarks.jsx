import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import useUserInfo from '../useUserInfo'
import axios from 'axios'
import { showNotification } from '../../utils/showNotification'

export default function usePlayerBookmarks(trigger) {
    const [playerBookmarks, setPlayerBookmarks] = useState()
    const { token } = useContext(AuthContext)
    const { userId } = useUserInfo()
    const [playerBookmarksLoading, setPlayerBookmarksLoading] = useState(false)

    useEffect(() => {
        setPlayerBookmarksLoading(true)

        if (!userId) return

        axios
            .get(`/api/players/${userId}/bookmarks`, {
                headers: { token }
            })
            .then((res) => {
                setPlayerBookmarks(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(setPlayerBookmarksLoading(false))
    }, [userId, trigger])

    /**
     * Function for removing a player from bookmarked players array
     *
     * @param {string} playerIdToRemove
     */
    const removeBookmark = async (playerId) => {
        setPlayerBookmarksLoading(true)

        try {
            await axios.post(
                `/api/players/${userId}/removeBookmark`,
                {
                    removeId: playerId
                },
                { headers: { token } }
            )
            showNotification('Bookmark removed', 'success', 3000)
        } catch (err) {
            console.log(err)
        } finally {
            setPlayerBookmarksLoading(false)
        }
    }

    /**
     * Functino for adding a player to players bookmakrs array
     *
     * @param {string} playerIdToBookmark
     */
    const addBookmark = async (playerId) => {
        setPlayerBookmarksLoading(true)

        try {
            await axios.post(
                `/api/players/${userId}/addBookmark`,
                {
                    playerIdToBookmark: playerId
                },
                { headers: { token } }
            )
            showNotification('Bookmark added', 'success', 3000)
        } catch (err) {
            console.log(err)
        } finally {
            setPlayerBookmarksLoading(false)
        }
    }

    return { playerBookmarks, playerBookmarksLoading, removeBookmark, addBookmark }
}
