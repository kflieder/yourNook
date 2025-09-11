'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserDocHelper } from '../userDocHelper';

export function useDisplayProfilePic() {
    const { username, loading }: any = useAuth();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    useEffect(() => {
            if (loading || !username?.uid) return;
            const userDoc = getUserDocHelper(username?.uid);
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