import './LoginRegister.css'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useCookies from '../../hooks/useCookies'
import useAuth from '../../hooks/useAuth'

export default function LoginPage() {
    const { cookiesAccepted, cookieError } = useCookies()
    const { login, authError } = useAuth()

    /* 
          Using react hook form for form validation in the whole applications 
          https://react-hook-form.com/get-started#Quickstart
      */
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    // On submit we send a request to the login route with the data from the form
    const onSubmit = async (data) => {
        if (!cookiesAccepted) return

        login(data)
    }

    return (
        <main>
            <form onSubmit={handleSubmit(onSubmit)} className="form__login">
                <label htmlFor="email">Email:</label>

                <input
                    /* Using react-hook-form register to register each input in the form */
                    {...register('email', {
                        required: {
                            // Input required
                            value: true,
                            message: 'Email is required'
                        },
                        pattern: {
                            // Check for email pattern on client side
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email'
                        }
                    })}
                    type="text"
                    aria-invalid={errors.email ? 'true' : 'none'}
                    aria-describedby="email-helper"
                />

                {/* Checking the react hook form errors object for errors, if so render error message under appropriate input */}
                {errors.email && (
                    <small id="email-helper" role="alert">
                        {errors.email.message}
                    </small>
                )}

                <label htmlFor="password">Password:</label>
                <input
                    {...register('password', {
                        required: {
                            // Input required
                            value: true,
                            message: 'Password is required'
                        }
                    })}
                    type="password"
                    aria-invalid={errors.password ? 'true' : 'none'}
                    aria-describedby="password-helper"
                />
                {errors.password && (
                    <small id="password-helper" role="alert">
                        {errors.password.message}
                    </small>
                )}

                {authError && (
                    <p className="form__alert" role="alert">
                        {' '}
                        {authError}{' '}
                    </p>
                )}
                {cookieError && (
                    <p className="form__alert" role="alert">
                        {' '}
                        {cookieError}{' '}
                    </p>
                )}
                <input type="submit" value="Login" />
            </form>

            <Link to="/register">Not registered?</Link>
        </main>
    )
}
