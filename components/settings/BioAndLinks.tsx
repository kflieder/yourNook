'use client'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useUserDoc } from '@/hooks/useUserDoc';

function BioAndLinks() {
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
    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        async function fetchSettings() {
            if (!username?.uid) return; 
            const userDoc = useUserDoc(username?.uid);
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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const userDoc = useUserDoc(username?.uid);
        if (!userDoc) {
            console.error('User document not found');
            return;
        }
        await userDoc.setUserData({
            displayName,
            pronouns,
            bio,
            links
        });
        setIsEditable(false);
        console.log('Profile updated successfully!');
        console.log('Display Name:', displayName);
        console.log('Pronouns:', pronouns);
        console.log('Bio:', bio);
        console.log('Links:', links);
    }

    function handleEdit() {
        setIsEditable(true);
    }


    return (
        <div>
            <div className='flex flex-col gap-4 w-50 border'>
                <div className="flex flex-col border">
                    <label htmlFor="displayName">Display Name</label>
                    <input className="border" type="text" id='displayName' name="displayName" placeholder={username?.displayName || ''}
                        onChange={(e) => setDisplayName(e.target.value)} value={displayName}
                        disabled={!isEditable}
                    />
                </div>
                <div className='border'>
                    <h1>Pronouns</h1>
                    <div className='flex flex-wrap'>

                        <input className="" type="checkbox" id='she' name="she" placeholder='she'
                            onChange={(e) => setPronouns({ ...pronouns, she: e.target.checked })}
                            checked={pronouns.she}
                            disabled={!isEditable}
                        />
                        <label htmlFor="she">She</label>
                        <input className="" type="checkbox" id='He' name="He" placeholder='He'
                            onChange={(e) => setPronouns({ ...pronouns, he: e.target.checked })}
                            checked={pronouns.he}
                            disabled={!isEditable}
                        />
                        <label htmlFor="He">He</label>
                        <input className="" type="checkbox" id='they/them' name="they/them" placeholder='they/them'
                            onChange={(e) => setPronouns({ ...pronouns, theyThem: e.target.checked })}
                            checked={pronouns.theyThem}
                            disabled={!isEditable}
                        />
                        <label htmlFor="they/them">They/Them</label>
                        <label htmlFor="other">Other:</label>
                        <input className="border" type="text" id='other' name="other" placeholder='other'
                            onChange={(e) => setPronouns({ ...pronouns, other: e.target.value })}
                            value={pronouns.other}
                            disabled={!isEditable}
                        />

                    </div>
                </div>
                <div className='border'>
                    <label htmlFor="bio">Bio</label>
                    <br />
                    <textarea id='bio' name="bio" placeholder='Write a short bio about yourself'
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                        disabled={!isEditable}
                    ></textarea>
                </div>
                <div className='border'>
                    <label htmlFor="links">Links</label>
                    <input className="border" type="url" id='links' name="links" placeholder='Links'
                        onChange={(e) => setLinks(e.target.value)}
                        value={links}
                        disabled={!isEditable}
                    />

                </div>
                {
                    isEditable ? (
                        <button onClick={handleSubmit}
                            className='bg-blue-500 text-white p-2 rounded' type='submit'>Save</button>
                        )
                        :
                        (<button onClick={handleEdit}
                            className='bg-blue-500 text-white p-2 rounded' type='button'>Edit</button>
                        )
                }

            </div>
        </div>
    )
}

export default BioAndLinks