'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserDoc } from '../userDocHelper';

export function displayProfilePic() {
    const { username, loading }: any = useAuth();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    useEffect(() => {
            if (loading || !username?.uid) return;
            const userDoc = useUserDoc(username?.uid);
            if (!userDoc) return;
            const { fetchUserData } = userDoc;
    
    
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

    return {
        profilePicture, 
        previewUrl,
        setProfilePicture,
        setPreviewUrl,
    }
}