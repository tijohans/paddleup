import { useState } from 'react'
import CreateMatchPopup from '../../components/CreateMatchPopup/CreateMatchPopup'
import DashboardButton from '../../components/DashboardButton/DashboardButton'
import useUserInfo from '../../hooks/useUserInfo'
import './Dashboard.css'

export default function LandingPage() {
    const [isOpen, setIsOpen] = useState(false)
    const { userId, userRole } = useUserInfo()

    const toggleIsOpen = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            <CreateMatchPopup isOpen={isOpen} toggleIsOpen={toggleIsOpen} />
            <section className="section__dashboard">
                <h1>Dashboard</h1>

                {/* Creating five instances of a dashboard button with different types of values */}
                <div className="div__button-container">
                    <DashboardButton
                        variant={1}
                        icon="/icons/match_icon.svg"
                        size="large"
                        onClick={toggleIsOpen}
                    >
                        Play a match
                    </DashboardButton>

                    <DashboardButton variant={2} icon="/icons/friends_icon.svg" link="/bookmarks">
                        Friends
                    </DashboardButton>

                    <DashboardButton
                        variant={4}
                        icon="/icons/leaderboard_icon.svg"
                        link="/leaderboard"
                    >
                        Leaderboard
                    </DashboardButton>

                    {userRole !== 'admin' ? (
                        <DashboardButton
                            variant={3}
                            icon="/icons/profile_icon.svg"
                            link={`/users/${userId}`}
                        >
                            Profile
                        </DashboardButton>
                    ) : (
                        <DashboardButton variant={3} icon="/icons/admin_icon.svg" link={`/admin`}>
                            Admin
                        </DashboardButton>
                    )}

                    <DashboardButton variant={3} icon="/icons/stats_icon.svg" link="/matches">
                        Statistics
                    </DashboardButton>

                    <DashboardButton variant={5} icon="/icons/players_icon.svg" link="/users">
                        Players
                    </DashboardButton>
                </div>
            </section>
        </>
    )
}
