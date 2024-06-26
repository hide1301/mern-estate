import userRouter from './user.route.js'
import authRouter from './auth.route.js'

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/auth', authRouter)

    return app.use('/', (req, res) => {
        res.send('Server on ...')
    })
}

export default initRoutes
