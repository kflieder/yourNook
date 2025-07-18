'use client'
import React from 'react'
import { useAuth } from '@/context/AuthContext';
import { useUserDoc } from '@/utilities/getUserDocHelper';
import { storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { displayProfilePic } from '@/utilities/displayProfilePic';


function ProfilePicutre() {
    const { username }: any = useAuth();
    const { profilePicture,
        previewUrl,
        setProfilePicture,
        setPreviewUrl } = displayProfilePic();


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
        <div className="flex flex-col bg-white border-2 border-blue-950 rounded p-5 items-center gap-4">
            <div className='border p-5'>

                
                    <div>
                        <img
                            src={previewUrl  ?? '/profileAvatar.png'}
                            alt="Profile Preview"
                            className="w-56 h-56 rounded-full object-cover border-2"
                        />
                    </div>
                
            </div>
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
                {
                    !profilePicture ? (
                        <label htmlFor="profilePicture" className="inline-block text-center px-4 py-2 rounded cursor-pointer transition-colors bg-gray-200 hover:bg-gray-300">
                            Choose Picture
                        </label>
                    ) : (
                        <button
                            onClick={handleUploadProfilePic}
                            className="inline-block text-center px-4 py-2 rounded cursor-pointer transition-colors bg-blue-500"
                        >
                            Upload Picture
                        </button>
                    )

                }

            </div>





        </div>
    )
}

export default ProfilePicutre