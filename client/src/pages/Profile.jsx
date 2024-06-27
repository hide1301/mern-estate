/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    ref,
    getStorage,
    getDownloadURL,
    uploadBytesResumable,
} from 'firebase/storage'
import { app } from '../firebase'
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutStart,
    signOutSuccess,
    signOutFailure,
} from '../redux/user/userSlice'

export default function Profile() {
    const fileRef = useRef(null)
    const dispatch = useDispatch()
    const { currentUser, loading, error } = useSelector((state) => state.user)
    const [file, setFile] = useState(undefined)
    const [fileUploadPerc, setFileUploadPerc] = useState(0)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [formData, setFormData] = useState({})

    useEffect(() => {
        if (file) handleFileUpload(file)
    }, [file])

    const handleFileUpload = (file) => {
        const storage = getStorage(app)
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setFileUploadPerc(Math.round(progress))
            },
            (error) => {
                setFileUploadError(true)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) =>
                    setFormData({ ...formData, avatar: downloadUrl })
                )
            }
        )
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            dispatch(updateUserStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if (data.success === false) {
                dispatch(updateUserFailure(data.message))
                return
            }
            dispatch(updateUserSuccess(data))
            setUpdateSuccess(true)
        } catch (error) {
            dispatch(updateUserFailure(error.message))
        }
    }

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            })
            const data = await res.json()
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message))
                return
            }
            dispatch(deleteUserSuccess(data.message))
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }

    const handleSignOut = async () => {
        try {
            dispatch(signOutStart())
            const res = await fetch('/api/auth/signout')
            const data = await res.json()
            if (data.success === false) {
                dispatch(signOutFailure(data.message))
                return
            }
            dispatch(signOutSuccess(data.message))
        } catch (error) {
            dispatch(signOutFailure(error.message))
        }
    }

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                />
                <img
                    onClick={() => fileRef.current.click()}
                    src={formData.avatar || currentUser.avatar}
                    alt="profile"
                    className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"
                />
                <p className="text-sm self-center">
                    {fileUploadError ? (
                        <span className="text-red-500">Error image upload</span>
                    ) : fileUploadPerc > 0 && fileUploadPerc < 100 ? (
                        <span className="text-slate-700">{`Uploading ${fileUploadPerc}%`}</span>
                    ) : fileUploadPerc === 100 ? (
                        <span className="text-green-700">
                            Image successfully uploaded!
                        </span>
                    ) : (
                        ''
                    )}
                </p>
                <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    defaultValue={currentUser.username}
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                />
                <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    defaultValue={currentUser.email}
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                />
                <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                />
                <button
                    disabled={loading}
                    type="submit"
                    className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
                >
                    {loading ? 'Loading...' : 'Update'}
                </button>
            </form>
            <div className="flex justify-between mt-5">
                <span
                    onClick={handleDeleteUser}
                    className="text-red-700 cursor-pointer hover:underline"
                >
                    Delete account
                </span>
                <span
                    onClick={handleSignOut}
                    className="text-red-700 cursor-pointer hover:underline"
                >
                    Sign out
                </span>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {updateSuccess && (
                <p className="text-green-500 mt-4">
                    User is updated successfully!
                </p>
            )}
        </div>
    )
}
