import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { deleteUser } from 'firebase/auth'
import { useUserDoc } from '@/hooks/useUserDoc'

function DeleteAccount() {
    const { username, firebaseUser } = useAuth()
    
    
    async function handleDeleteAccount() {
        
        if (!username || !firebaseUser) {
            console.error('No user is logged in')
            return
        }
        const { setUserData } = useUserDoc(username?.uid)
        
        try {
            await setUserData({deleted: true})
            await deleteUser(firebaseUser)
            console.log('Account deleted successfully')
            // Optionally, redirect to a different page or show a success message
        } catch (error) {
            console.error('Error deleting account:', error)
            alert('Failed to delete account. Please try again.')
        }
    }



  return (
    <div>
        <button onClick={handleDeleteAccount} className="w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
            Delete Account
        </button>
    </div>
  )
}

export default DeleteAccount