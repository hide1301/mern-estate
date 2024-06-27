import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { errorHandler } from '../utils/errorHandler.js'

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body

    try {
        const userExists = await User.findOne({
            $or: [{ username }, { email }],
        })

        if (userExists) {
            if (userExists.username === username)
                return next(
                    errorHandler(409, 'Username already exists in the system!')
                )

            if (userExists.email === email)
                return next(
                    errorHandler(409, 'Email already exists in the system!')
                )
        }
        const hashedPassword = bcryptjs.hashSync(password, 10)
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        })
        await newUser.save()
        res.status(201).json('User created successfully!')
    } catch (error) {
        next(error)
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const validUser = await User.findOne({ email })
        if (!validUser) return next(errorHandler(404, 'User not found!'))

        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'))

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        const { password: pass, ...rest } = validUser._doc
        res.cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest)
    } catch (error) {
        next(error)
    }
}

export const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token')
        res.status(200).json('User has been log out!')
    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next) => {
    const { name, email, photo } = req.body
    try {
        const userExists = await User.findOne({ email })
        if (userExists) {
            const token = jwt.sign(
                { id: userExists._id },
                process.env.JWT_SECRET
            )
            const { password: pass, ...rest } = userExists._doc
            res.cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest)
        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
            const newUser = new User({
                username:
                    name.split(' ').join('').toLowerCase() +
                    Math.random().toString(36).slice(-4),
                email,
                password: hashedPassword,
                avatar: photo,
            })
            await newUser.save()
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
            const { password: pass, ...rest } = newUser._doc
            res.cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest)
        }
    } catch (error) {
        next(error)
    }
}
