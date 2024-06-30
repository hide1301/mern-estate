import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import initRoutes from './routes/index.js'
import cookieParser from 'cookie-parser'
import path from 'path'
dotenv.config()

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Connected to MongoDB!')
  })
  .catch((err) => {
    console.log(err)
  })

const __dirname = path.resolve()

const app = express()

app.use(express.json())
app.use(cookieParser())

initRoutes(app)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
