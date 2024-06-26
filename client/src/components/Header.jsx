import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import icons from '../utils/icons'

const { FaSearch } = icons

export default function Header() {
    const { currentUser } = useSelector((state) => state.user)

    return (
        <header className="bg-slate-200 shadow-md">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
                <Link to="/">
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-slate-500">Hidedev</span>
                        <span className="text-slate-700">Estate</span>
                    </h1>
                </Link>
                <form className="bg-slate-100 p-3 rounded-lg flex items-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent focus:outline-none w-24 sm:w-64"
                    />
                    <FaSearch className="text-slate-600" />
                </form>
                <ul className="flex gap-4">
                    <li className="hidden sm:inline hover:underline">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="hidden sm:inline hover:underline">
                        <Link to="/about">About</Link>
                    </li>
                    {currentUser ? (
                        <li>
                            <Link to="/profile">
                                <img
                                    src={currentUser.avatar}
                                    alt="profile"
                                    className="border-2 border-red-500 rounded-full h-7 w-7 object-cover"
                                />
                            </Link>
                        </li>
                    ) : (
                        <li className="hover:underline">
                            <Link to="/sign-in">Sign In</Link>
                        </li>
                    )}
                </ul>
            </div>
        </header>
    )
}
