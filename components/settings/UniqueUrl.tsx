import React, { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase'; 
import { useUserDoc } from '@/hooks/useUserDoc'; 
import { useAuth } from '@/context/AuthContext'
import { useUniqueUrl } from '@/hooks/useUniqueUrl'; 

function UniqueUrl() {
    const { username }: any = useAuth();
    const [isEditable, setIsEditable] = useState(false);
   

   const {
        uniqueUrl,
        setUniqueUrl,
        originalUrl,
        setOriginalUrl,
   } = useUniqueUrl();



    async function handleSave() {
        const { updateUserData } = useUserDoc(username?.uid);

        if (uniqueUrl === originalUrl) {
            setIsEditable(false);
            return; // No changes made, exit early
        }
        const q = query(collection(db, 'users'), where('uniqueUrl', '==', uniqueUrl));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            alert('This URL is unavailable!');
        } else {
            await updateUserData({ uniqueUrl: uniqueUrl.trim().toLowerCase() });
            
            setOriginalUrl(uniqueUrl);
            setIsEditable(false);
        }
        
    }

    function handleEdit() {
        setIsEditable(true);
    }

    const editButton = (
        <div>
        {
            isEditable ? (
                <button
                    className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleSave}
                >
                    Save
                </button>
            ) : (
                <button
                    className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    onClick={handleEdit}
                >
                    Edit
                </button>
            )
        }
        </div>
    
    )
    return (
        <div className='flex flex-col items-center p-4 border-2 border-blue-950 rounded-md bg-white mb-5'>
            <div className="flex gap-2 items-center align-middle">
            <input
                type="text"
                placeholder="Enter your unique URL"
                id="uniqueUrl"
                name="uniqueUrl"
                className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isEditable ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : ''
                  }`}
                onChange={(e) => setUniqueUrl(e.target.value)}
                value={uniqueUrl}
                disabled={!isEditable}
    
            />
            {editButton}
            </div>
            <label htmlFor='uniqueUrl' className="text-sm text-gray-500 mt-2">
                This will be your unique URL for your profile.
            </label>
        </div>
    )
}

export default UniqueUrl