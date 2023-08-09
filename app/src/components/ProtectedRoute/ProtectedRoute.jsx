import { Outlet, Navigate } from 'react-router-dom'

/* 
    Checking if the user is logged in or not, 
        if the user is log in just display the children, 
        if the user is logged out, redirect to specified page
*/
export default function ProtectedRoute({ loggedin, redirect, children }) {
    if (!loggedin) {
        return <Navigate to={redirect} replace />
    }

    return children ? children : <Outlet />
}
