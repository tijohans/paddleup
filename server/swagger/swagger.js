// Swagger specification and options
// ? Source: https://medium.com/@adarsh_d/streamline-your-node-js-api-with-swagger-a-step-by-step-guide-ea684db14847
// ? Source 2: https://swagger.io/docs/
// https://www.npmjs.com/package/swagger-ui-express

import fs from 'fs'
import YAML from 'yaml'
import { swaggerPlayerSchema } from '../models/playerSchema.js'
import { swaggerMatchesSchema } from '../models/matchesSchema.js'
import { swaggerRefreshTokenSchema } from '../models/refreshTokenSchema.js'
import { swaggerValidationSchema } from '../models/validationSchema.js'

// Import the yaml file and parse it to JSON
const file = fs.readFileSync('./swagger/swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

// Assign the mongoose2swagger schemaes
const swaggerSchemas = {
    Player: swaggerPlayerSchema,
    Match: swaggerMatchesSchema,
    Validation: swaggerValidationSchema,
    RefreshToken: swaggerRefreshTokenSchema
}

// Assign the generated schemaes to the parsed yaml config
Object.assign(swaggerDocument.components.schemas, swaggerSchemas)

export { swaggerDocument }
