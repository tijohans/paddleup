import React, { useEffect } from 'react'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { showNotification } from '../../utils/showNotification'
import useUserInfo from '../../hooks/useUserInfo'
import usePlayer from '../../hooks/Players/usePlayer'
import ReactLoading from 'react-loading'

function UserEdit() {
    const { token } = useContext(AuthContext)
    const { id } = useParams()
    const { player, playerLoading } = usePlayer(id)
    const { userRole } = useUserInfo()
    const [admin, setAdmin] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        if (userRole && userRole === 'admin') setAdmin(true)
    }, [userRole])

    // Set up react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    useEffect(() => {
        if (!player) {
            return
        }

        // When the user is retrieved, reset the form data
        // Based on if you are admin or not, fill form correctly.
        if (admin) {
            reset({
                username: player.username,
                name: player.name,
                department: player.department,
                email: player.email,
                validated: player.valid,
                points: player.points
            })
        } else {
            reset({
                username: player.username,
                name: player.name,
                department: player.department,
                email: player.email
            })
        }
    }, [player])

    const updatePlayer = (formdata) => {
        // Fire the request
        axios
            .patch(`/api/players/${id}`, formdata, {
                headers: { token }
            })
            .then((res) => {
                // Navigate & alert properly based on role
                admin ? navigate(`/admin`) : navigate(`/users/${id}`)
                admin
                    ? showNotification('User updated!', 'success', 3000)
                    : showNotification('Your info has been updated!', 'success', 3000)
            })
            .catch((error) => {
                // If there was an error, log it and alert the user.
                console.error(error)
                showNotification('An error occured during updating data.', 'error', 3000)
            })
    }

    const onSubmit = (data) => {
        // Check if passwords match in the form, if not return
        if (data.password !== data.password2) {
            showNotification('Passwords do not match!', 'error', 2000)
            return
        }
        // Create an object, formatting the form data properly
        let formdata

        if (admin) {
            formdata = {
                username: data.username,
                name: data.name,
                department: data.department,
                email: data.email,
                valid: data.validated,
                points: data.points
            }
        } else {
            formdata = {
                username: data.username,
                name: data.name,
                department: data.department,
                email: data.email
            }
        }

        // Only add password to the updating data if it has been changed (normal user only)
        if (data.password && !admin) {
            formdata.password = data.password
        }

        updatePlayer(formdata)
    }

    return (
        <main>
            {playerLoading ? (
                <ReactLoading type="spinningBubbles" color="#000" />
            ) : (
                <>
                    <h1>Edit user info:</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* ---------------------------- */}
                        {/* USERNAME */}
                        <label htmlFor="username">Username</label>
                        <input
                            {...register('username', {
                                required: {
                                    value: true,
                                    message: 'Username is required'
                                }
                            })}
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Username"
                            aria-invalid={errors.username ? 'true' : 'none'}
                            aria-describedby="username-helper"
                        />
                        {errors.username && (
                            <small id="username-helper" role="alert">
                                {errors.username.message}
                            </small>
                        )}
                        {/* ---------------------------- */}
                        {/* NAME */}
                        <label htmlFor="name">Name</label>
                        <input
                            {...register('name', {
                                required: {
                                    value: true,
                                    message: 'Name is required'
                                }
                            })}
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Name"
                            aria-invalid={errors.name ? 'true' : 'none'}
                            aria-describedby="name-helper"
                        />
                        {errors.name && (
                            <small id="name-helper" role="alert">
                                {errors.name.message}
                            </small>
                        )}
                        {/* ---------------------------- */}
                        {/* DEPARTMENT */}
                        <label htmlFor="department">Department</label>
                        <select
                            {...register('department')}
                            name="department"
                            id="department"
                            aria-invalid={errors.department ? 'true' : 'none'}
                            aria-describedby="department-helper"
                        >
                            {errors.department && (
                                <small id="department-helper" role="alert">
                                    {errors.department.message}
                                </small>
                            )}
                            <option value="1">Department of Design</option>
                            <option value="2">...</option>
                        </select>
                        {/* ---------------------------- */}
                        {/* EMAIL */}
                        <label htmlFor="email">Email</label>
                        <input
                            {...register('email', {
                                required: {
                                    value: true,
                                    message: 'Email is required'
                                },
                                pattern: {
                                    // Check for email pattern
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email'
                                }
                            })}
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            aria-invalid={errors.email ? 'true' : 'none'}
                            aria-describedby="email-helper"
                        />
                        {errors.email && (
                            <small id="email-helper" role="alert">
                                {errors.email.message}
                            </small>
                        )}

                        {admin ? (
                            <>
                                <div>
                                    {/* ---------------------------- */}
                                    {/* VALIDATED EMAIL (ADMIN) */}
                                    <label htmlFor="validated">Validated Email</label>
                                    <input
                                        {...register('validated')}
                                        type="checkbox"
                                        name="validated"
                                        id="validated"
                                    />
                                </div>

                                {/* ---------------------------- */}
                                {/* POINTS (ADMIN) */}
                                <label htmlFor="points">Points</label>
                                <input
                                    {...register('points')}
                                    type="number"
                                    name="points"
                                    id="points"
                                    placeholder="0"
                                />
                            </>
                        ) : (
                            <>
                                {/* ---------------------------- */}
                                {/* PASSWORD */}
                                <label htmlFor="password">Password</label>
                                <input
                                    {...register('password')}
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                />
                                {/* ---------------------------- */}
                                {/* PASSWORD REPEAT */}
                                <label htmlFor="password2">Repeat Password</label>
                                <input
                                    {...register('password2')}
                                    type="password"
                                    name="password2"
                                    id="password2"
                                    placeholder="Repeat Password"
                                />
                            </>
                        )}
                        <button type="submit">Save</button>
                    </form>
                </>
            )}
        </main>
    )
}

export default UserEdit
