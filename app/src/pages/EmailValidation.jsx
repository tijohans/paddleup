import useValidateEmail from '../hooks/useValidateEmail'

function EmailValidation() {
    const { validateEmail } = useValidateEmail()

    return (
        <main>
            <h1>Email Validation</h1>
            <button onClick={() => validateEmail()}>Confirm</button>
        </main>
    )
}

export default EmailValidation
