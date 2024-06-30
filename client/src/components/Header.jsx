/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import icons from '../utils/icons'

const { FaSearch } = icons

export default function Header() {
  const { currentUser } = useSelector((state) => state.user)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParms = new URLSearchParams(window.location.search)
    urlParms.set('searchTerm', searchTerm)
    const searchQuery = urlParms.toString()
    navigate(`/search?${searchQuery}`)
  }

  useEffect(() => {
    const urlParms = new URLSearchParams(window.location.search)
    const searchTermFromUrl = urlParms.get('searchTerm')
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  }, [location.search])

  useEffect(() => {
    if (!location.pathname.includes('/search')) setSearchTerm('')
  }, [location.pathname])

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Hidev</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <button type="submit">
            <FaSearch className="text-slate-600" />
          </button>
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
