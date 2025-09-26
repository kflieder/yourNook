'use client'
import React, { useState, useRef } from 'react'
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, getAuth } from 'firebase/auth'
import { useAlert } from 'components/customAlertModal/AlertProvider'

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isEditable, setIsEditable] = useState(false)
    const { show } = useAlert()
    const buttonRef = useRef<HTMLButtonElement>(null);

    async function handleChangePassword() {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            console.error('No user is logged in')
            return
        }
        if (!user.email) {
            console.error('User email is missing')
            return
        }

        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword)
            await reauthenticateWithCredential(user, credential)
            await updatePassword(user, newPassword)
            setIsEditable(false)
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error) {
            console.error('Error changing password:', error)
            show("Failed to change password (likely due to invalid password). Please try again.", { bottom: 30, left: 20 }, buttonRef);

        }

    }

    function handleEdit() {
        setIsEditable(true)
    }

    return (
        <div className='border p-4 rounded-md shadow-md max-w-md bg-white w-full sm:w-1/2'>
            <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm ${isEditable ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'}`}
                disabled={!isEditable}
            />
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 mt-2 text-sm ${isEditable ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'}`}
                disabled={!isEditable}
            />
            <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 mt-2 text-sm ${isEditable ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'}`}
                disabled={!isEditable}
            />
            {
                isEditable ? (
                    <div>
                    <button
                    ref={buttonRef}
                        onClick={() => {
                            if (newPassword === confirmPassword) {
                                handleChangePassword()
                                show("Password changed successfully.", { bottom: 30, left: 20 }, buttonRef);
                            } else {
                                show("New passwords do not match.", { bottom: 30, left: 20 }, buttonRef);
                            }
                        }}
                        className="mt-4 cursor-pointer bg-blue-950 text-white p-1 text-sm rounded-md hover:bg-gray-600"
                    >
                        Change Password
                    </button>
                    <button
                        onClick={() => setIsEditable(false)}
                        className="mt-4 ml-2 bg-gray-300 text-gray-700 p-1 text-sm rounded-md hover:bg-gray-400 cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
                ) : (
                    <button
                        onClick={handleEdit}
                        className="mt-4 bg-gray-300 text-gray-700 p-1 text-sm rounded-md hover:bg-gray-400 cursor-pointer"
                    >
                        Edit Password
                    </button>
                )
            }

        </div>
    )
}

export default ChangePassword