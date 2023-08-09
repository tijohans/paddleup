import './LoginRegister.css'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function RegisterPage() {
    // const [serverError, setServerError] = useState()
    const { registerUser, authError } = useAuth()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm()

    const navigate = useNavigate()

    // Function for handling form submit, requesting the register route on the server with the data from the form
    const onSubmit = (data) => {
        /* 
            Removing password2 from the object, before submitting to register.  
            Password2 is only used to validate that they have entered the correct password
        */
        delete data.password2

        registerUser(data)
    }

    return (
        <main>
            <h1>Register</h1>

            <form className="form__register" onSubmit={handleSubmit(onSubmit)}>
                {/* 
                    Saving this code if we want to add an image later

                    <div>
                        <label htmlFor="imga">Image</label>
                        <img id="imga" src="test.jpg" alt="Image goes here" />
                        <input type="file"/>
                    </div> 
                */}

                {/* Displaying the server error at the top of the form */}
                {authError ? (
                    <span className="form__alert" role="alert">
                        {authError}
                    </span>
                ) : null}

                <label htmlFor="email">Email:</label>
                <input {...register('email', { required: true })} name="email" type="email" />
                {errors.email && (
                    <span className="form__alert" role="alert">
                        This field is required
                    </span>
                )}

                <label htmlFor="name">Name:</label>
                <input {...register('name', { required: true })} name="name" type="name" />
                {errors.name && (
                    <span className="form__alert" role="alert">
                        This field is required
                    </span>
                )}

                <label htmlFor="username">Username:</label>
                <input
                    {...register('username', { minLength: 2, maxLength: 10, required: true })}
                    name="username"
                    type="text"
                />

                {/* Checking which type of error, and then displaying the appropriate error message */}
                {errors.username?.type === 'required' && (
                    <span className="form__alert" role="alert">
                        Username is required
                    </span>
                )}
                {errors.username?.type === 'minLength' && (
                    <span className="form__alert" role="alert">
                        Username must be atleast 2 characters
                    </span>
                )}
                {errors.username?.type === 'maxLength' && (
                    <span className="form__alert" role="alert">
                        Username cannot exceed 10 characters
                    </span>
                )}

                <label htmlFor="department">Department:</label>
                <select {...register('department')} name="department" id="department">
                    <option value="1">Department of Design</option>
                    <option value="2">...</option>
                </select>

                <label htmlFor="password">Password:</label>
                <input {...register('password')} name="password" type="password" />

                <label htmlFor="password2">Repeat Password:</label>

                {/* 
                    Validating that both password are the same before sending in the form data 
                    https://stackoverflow.com/questions/70480928/how-to-validate-password-and-confirm-password-in-react-hook-form-is-there-any-v
                */}
                <input
                    type="password"
                    {...register('password2', {
                        required: true,
                        validate: (val) => {
                            if (watch('password') != val) {
                                return 'Your passwords do no match'
                            }
                        }
                    })}
                />
                {errors.password2?.type === 'required' && (
                    <span className="form__alert" role="alert">
                        You need to repeat your password
                    </span>
                )}
                {errors.password2?.type === 'validate' && (
                    <span className="form__alert" role="alert">
                        Passwords do not match
                    </span>
                )}

                <input type="submit" value="Register" />
            </form>
        </main>
    )
}
