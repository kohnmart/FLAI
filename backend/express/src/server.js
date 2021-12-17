// hello world from https://expressjs.com/de/starter/hello-world.html
import express from 'express'
const app = express()

import cors from 'cors'

//import routes
import { exercise } from './routes/exercise.js'

// middleware
app.use(express.json())
app.use(cors())
app.use('/api/exercise', exercise)

// server
const port = process.env.PORT
app.listen(port, () => {
  console.log(`FLAI app listening at http://localhost:${port}`)
})
