import { i18n } from '../helpers/i18n'
import nodemailer from 'nodemailer'

/**
 *
 * @returns email transporter instance
 */
const createEmailTransporter = () => {
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_VALIDATION_USER,
            pass: process.env.MAIL_PASS
        }
    })
}

/**
 *
 * @param {string} email
 * @param {string} username
 * @param {string} confirmationLink
 * @returns {boolean} if the mail has been sent or not
 */
export const sendValidationEmail = (email, username, confirmationLink) => {
    const transporter = createEmailTransporter()

    const mailOptions = {
        from: process.env.EMAIL_VALIDATION_USER,
        to: email,
        subject: i18n.email.subject,
        html: `
      <h1>Welcome to PaddleUp, ${username}!</h1>
      <p>Please click the button below to confirm your email address:</p>
      <a href="${confirmationLink}">Confirm Email</a>
    `
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}
