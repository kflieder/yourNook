import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { deleteUser } from 'firebase/auth'
import { getUserDocHelper } from '@/utilities/userDocHelper'

function DeleteAccount() {
    const { username, firebaseUser } = useAuth()
    const [showModal, setShowModal] = React.useState(false);

    function handleFirstClick() {
        setShowModal(true);
       
    }

    const alertModal = () => {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Confirm Account Deletion</h2>
                    <p className="mb-4">Are you sure you want to delete your account? This action is irreversible.</p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => { setShowModal(false)}}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >   Cancel</button>
                        <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >   Delete Account</button>
                    </div>
                </div>
            </div>
        );
    }
    
    
    async function handleDeleteAccount() {
        
        if (!username || !firebaseUser) {
            console.error('No user is logged in')
            return
        }
        const userDoc = getUserDocHelper(username?.uid)
        if (!userDoc) return;
        const { setUserData } = userDoc
        
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
        <button onClick={handleFirstClick} className="w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
            Delete Account
        </button>
        {showModal && alertModal()}
    </div>
  )
}

export default DeleteAccount