import React, {useRef} from 'react'
import { useAuth } from '@/context/AuthContext'
import { deleteUser } from 'firebase/auth'
import { getUserDocHelper } from '@/utilities/userDocHelper'
import { useAlert } from 'components/customAlertModal/AlertProvider'
import deleteUserContent from '@/utilities/deleteUserContent'

function DeleteAccount() {
    const { username, firebaseUser } = useAuth()
    const [showModal, setShowModal] = React.useState(false);
    const { show } = useAlert();
    const buttonRef = useRef<HTMLButtonElement>(null);

    function handleFirstClick() {
        setShowModal(true);
       
    }

    const alertModal = () => {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Confirm Account Deletion</h2>
                    <p className="mb-4">Are you sure you want to delete your account? All your content will be deleted and this action is irreversible.</p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => { setShowModal(false)}}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >   Cancel</button>
                        <button
                            ref={buttonRef}
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 bg-red-400 cursor-pointer text-white rounded hover:bg-red-600"
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
            await deleteUserContent(username.uid)
            console.log('Account deleted successfully')
            // Optionally, redirect to a different page or show a success message
        } catch (error) {
            if (error.code === 'auth/requires-recent-login') {
                show("Please log out and log back in before deleting your account.", { bottom: 45, right: 0 }, buttonRef);
                return;
            } else {
                show("Error deleting account. Please try again.", { bottom: 20, left: 20 }, buttonRef);
            }
             console.error('Error deleting account:', error)
        }
    }



  return (
    <div className='pt-10 border-t'>
        <button onClick={handleFirstClick} className="w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer">
            Delete Account
        </button>
        {showModal && alertModal()}
    </div>
  )
}

export default DeleteAccount