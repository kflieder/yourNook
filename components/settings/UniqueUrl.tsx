import React, { useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase'; 
import { useUserDoc } from '@/hooks/useUserDoc'; 
import { useAuth } from '@/context/AuthContext'


function UniqueUrl() {
    const [uniqueUrl, setUniqueUrl] = useState('');
    const { username }: any = useAuth();
    const [isEditable, setIsEditable] = useState(false);



    async function handleSave() {
        const { updateUserData } = useUserDoc(username?.uid);
        const q = query(collection(db, 'users'), where('uniqueUrl', '==', uniqueUrl));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            alert('This URL is unavailable!');
        } else {
            await updateUserData({ uniqueUrl });
            setIsEditable(false);
        }
        
    }

    function handleEdit() {
        setIsEditable(true);
    }
    return (
        <div>

            <input
                type="text"
                placeholder="Enter your unique URL"
                id="uniqueUrl"
                name="uniqueUrl"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setUniqueUrl(e.target.value)}
                value={uniqueUrl}
                disabled={!isEditable}
            // You can add more functionality here, like saving the unique URL
            />
            <label htmlFor='uniqueUrl' className="text-sm text-gray-500 mt-2">
                This will be your unique URL for your profile.
            </label>
            {
                isEditable ? (
                    <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                ) : (
                    <button
                        className="mt-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        onClick={handleEdit}
                    >
                        Edit
                    </button>
                )
            }
        
        </div>
    )
}

export default UniqueUrl