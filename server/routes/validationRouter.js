import express from 'express'
import { validateToken } from '../controllers/validationController.js'

const validationRouter = express()

validationRouter.post('/:token', validateToken)

export { validationRouter }
