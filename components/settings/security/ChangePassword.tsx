'use client'
import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth'

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { username } = useAuth()
    const [isEditable, setIsEditable] = useState(false)

    async function handleChangePassword() {
        if (!username) {
            console.error('No user is logged in')
            return
        }
        if (!username.email) {
            console.error('User email is missing')
            return
        }


        try {
            const credential = EmailAuthProvider.credential(username.email, currentPassword)
            await reauthenticateWithCredential(username, credential)
            await updatePassword(username, newPassword)
            setIsEditable(false)
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error) {
            console.error('Error changing password:', error)
            alert('Failed to change password. Please try again.')

        }

    }

    function handleEdit() {
        setIsEditable(true)
    }

    return (
        <div>
            <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!isEditable}
            />
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                disabled={!isEditable}
            />
            <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                disabled={!isEditable}
            />
            {
                isEditable ? (
                    <button
                        onClick={() => {
                            if (newPassword === confirmPassword) {
                                handleChangePassword()
                                console.log('Password changed successfully')
                            } else {
                                alert('Passwords do not match')
                            }
                        }}
                        className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    >
                        Change Password
                    </button>
                ) : (
                    <button
                        onClick={handleEdit}
                        className="mt-4 bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400"
                    >
                        Edit Password
                    </button>
                )
            }

        </div>
    )
}

export default ChangePassword