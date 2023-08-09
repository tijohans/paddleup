import TableButton from '../TableButton/TableButton'
import './UserTable.css'
import usePlayers from '../../hooks/Players/usePlayers'
import useDeleteUser from '../../hooks/useDeleteUser'
import useGeneratePassword from '../../hooks/useGeneratePassword'

export default function UserTable({ showID }) {
    const { deleteUser, deletedUser } = useDeleteUser()
    const { players } = usePlayers(deletedUser)
    const { generatePassword } = useGeneratePassword()

    const returnUsers = () => {
        return (
            players &&
            players.length > 0 &&
            players.map((user) => (
                <article>
                    <details>
                        <summary role="button">Username: {user.username}</summary>
                        <table className="table__userinfo">
                            <tbody>
                                {showID ? (
                                    <tr>
                                        <th>ID</th>
                                        <td>{user._id}</td>
                                    </tr>
                                ) : null}
                                <tr>
                                    <th scope="column">Full name</th>

                                    <td>{user.name}</td>
                                </tr>
                                <tr>
                                    <th scope="column">Email</th>

                                    <td>{user.email}</td>
                                </tr>

                                <tr>
                                    <th>Department</th>
                                    <td>{user.department}</td>
                                </tr>

                                <tr>
                                    <th>Points</th>
                                    <td>{user.points}</td>
                                </tr>
                                <tr>
                                    <th>Verified Email</th>
                                    <td>{user.valid ? 'Yes' : 'No'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </details>

                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <TableButton variant={3} flat={true} link={'/users/' + user._id + '/edit'}>
                            Edit
                        </TableButton>
                        <TableButton
                            variant={2}
                            flat={true}
                            onClick={() => {
                                generatePassword(user._id, user.username)
                            }}
                        >
                            Generate Password
                        </TableButton>
                        <TableButton
                            variant={2}
                            flat={true}
                            onClick={() => {
                                deleteUser(user._id, user.username)
                            }}
                        >
                            Delete
                        </TableButton>
                    </div>
                </article>
            ))
        )
    }

    return (
        <>
            <h2>All users</h2>
            {returnUsers()}
        </>
    )
}
