'use client'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext';
import { useUserDoc } from '@/hooks/useUserDoc';
import { storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


function ProfilePicutre() {


    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { username, loading }: any = useAuth();


    useEffect(() => {
        if (loading || !username?.uid) return;
        const { fetchUserData } = useUserDoc(username?.uid);


        async function fetchProfilePicture() {

            try {
                const data = await fetchUserData();
                if (data?.profilePicture) {
                    setPreviewUrl(data.profilePicture);
                }
            } catch (error) {
                console.error('Error fetching profile picture:', error);

            }
        }
        fetchProfilePicture();
    }, [loading, username]);

    async function handleUploadProfilePic() {
        if (!profilePicture) return;

        try {

            const storageRef = ref(storage, `profilePictures/${username?.uid}`);

            await uploadBytes(storageRef, profilePicture);
            const downloadUrl = await getDownloadURL(storageRef);
            const { updateUserData } = useUserDoc(username?.uid);
            await updateUserData({ profilePicture: downloadUrl });

            setProfilePicture(null);
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    }



    return (
        <div className="flex flex-col items-center gap-4">
            
                {previewUrl && (
                    <div className="mt-4">
                        <img
                            src={previewUrl}
                            alt="Profile Preview"
                            className="w-56 h-56 rounded-full object-cover border-2"
                        />
                    </div>
                )}
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setProfilePicture(file);
                                setPreviewUrl(URL.createObjectURL(file));
                            }
                        }
                        }
                        className='hidden'
                        id="profilePicture"
                        name="profilePicture"
                    />
                    <label htmlFor="profilePicture" className="cursor-pointer mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                        Choose File
                    </label>
                </div>

    
            <button
                onClick={handleUploadProfilePic}
                className={` ${!profilePicture ? 'opacity-50 cursor-not-allowed' : 'mt-2 px-4 py-2 bg-blue-500 text-white rounded'}`}
                disabled={!profilePicture}
            >
                Upload Profile Picture
            </button>


        </div>
    )
}

export default ProfilePicutre