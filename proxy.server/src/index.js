import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import { connect } from './config/db.js'
import { notFound, errorHandler } from './middlewares/error.middlewares.js'
import proxyRoutes from './routes/proxy.route.js'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use('/uploads', express.static(path.join(__dirname, '../', 'uploads')))

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running' })
})

app.use('/proxies', proxyRoutes)

app.use(notFound)
app.use(errorHandler)

connect()

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
