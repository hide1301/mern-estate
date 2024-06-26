import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import initRoutes from './routes/index.js'
dotenv.config()

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Connected to MongoDB!')
    })
    .catch((err) => {
        console.log(err)
    })

const app = express()
app.use(express.json())
initRoutes(app)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const msg = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        err: 1,
        statusCode,
        msg,
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
