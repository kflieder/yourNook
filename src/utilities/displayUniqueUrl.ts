'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserDoc } from './useUserDoc';


export function useUniqueUrl() {
    const [uniqueUrl, setUniqueUrl] = useState('');
    const { username }: any = useAuth();
    const [originalUrl, setOriginalUrl] = useState('');

     useEffect(() => {
            if (username?.uid) {
                const { fetchUserData } = useUserDoc(username?.uid);
                async function fetchUniqueUrl() {
                    try {
                        const data = await fetchUserData();
                        if (data?.uniqueUrl) {
                            setUniqueUrl(data.uniqueUrl);
                            setOriginalUrl(data.uniqueUrl);
                        }
                    } catch (error) {
                        console.error('Error fetching unique URL:', error);
                    }
                }
                fetchUniqueUrl();
            }
        }, [username]);
        return {
            uniqueUrl,
            setUniqueUrl,
            originalUrl,
            setOriginalUrl,
            uid: username?.uid
        }
}