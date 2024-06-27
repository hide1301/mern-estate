import userRouter from './user.route.js'
import authRouter from './auth.route.js'
import listingRouter from './listing.route.js'

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/auth', authRouter)
    app.use('/api/listing', listingRouter)

    return app.use('/', (req, res) => {
        res.send('Server on ...')
    })
}

export default initRoutes
