'use client';
import { useAuth } from '@/context/AuthContext';
import { getUserDocHelper } from '../userDocHelper';
import { useEffect, useState } from 'react';


export function displayBioInfo() {
    const { username }: any = useAuth();
    const [displayName, setDisplayName] = useState(username?.displayName || '');
    const [pronouns, setPronouns] = useState({
        she: false,
        he: false,
        theyThem: false,  
        other: ''
    });
    const [bio, setBio] = useState('');
    const [links, setLinks] = useState('');


    useEffect(() => {
            async function fetchSettings() {
                if (!username?.uid) return;
                const userDoc = getUserDocHelper(username?.uid);
                if (!userDoc) {
                    console.error('User document not found');
                    return;
                }
                await userDoc.fetchUserData().then(data => {
                    if (data) {
                        setDisplayName(data.displayName || '');
                        setPronouns({
                            she: data.pronouns?.she || false,
                            he: data.pronouns?.he || false,
                            theyThem: data.pronouns?.theyThem || false,
                            other: data.pronouns?.other || ''
                        });
                        setBio(data.bio || '');
                        setLinks(data.links || '');
                    }
                }
                ).catch(error => {
                    console.error('Error fetching user data:', error);
                });
            }
            fetchSettings();
        }, [username]);

    return {
        displayName,
        setDisplayName,
        pronouns,
        setPronouns,
        bio,
        setBio,
        links,
        setLinks
    };

}