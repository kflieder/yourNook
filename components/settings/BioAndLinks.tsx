'use client'
import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getUserDocHelper } from '@/utilities/userDocHelper';
import { useDisplayBioInfo } from '@/utilities/FetchProfileInfo/useDisplayBioInfo';
import { auth } from '../../lib/firebase';
import { updateProfile } from 'firebase/auth';

function BioAndLinks() {
    const { username }: any = useAuth();
    const [isEditable, setIsEditable] = useState(false);

    

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const userDoc = getUserDocHelper(username?.uid);
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
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
                displayName,
            });
        } else {
            console.error('No authenticated user found');
        }
        setIsEditable(false);
    }

    function handleEdit() {
        setIsEditable(true);
    }

    const { displayName, setDisplayName, pronouns, setPronouns, bio, setBio, links, setLinks } = useDisplayBioInfo();

    return (
        <div className='flex flex-col bg-white gap-4 border-2 border-blue-950 rounded p-2 w-full'>
            <div className="flex flex-col">
                <label className='mb-1' htmlFor="displayName">Display Name:</label>
                <input className="border p-1 rounded capitalize disabled:text-gray-400 disabled:bg-gray-50" type="text" id='displayName' name="displayName" placeholder={username?.displayName || ''}
                    onChange={(e) => setDisplayName(e.target.value)} value={displayName}
                    disabled={!isEditable}
                />
            </div>

            <div className=''>
                <h1>Pronouns:</h1>
                <div className='flex pl-4 gap-3 text-sm'>
                    <div>
                    <input className="mr-1" type="checkbox" id='she' name="she" placeholder='she'
                        onChange={(e) => setPronouns({ ...pronouns, she: e.target.checked })}
                        checked={pronouns.she}
                        disabled={!isEditable}
                    />
                    <label htmlFor="she">She</label>
                    </div>
                    <div>
                    <input className="mr-1" type="checkbox" id='He' name="He" placeholder='He'
                        onChange={(e) => setPronouns({ ...pronouns, he: e.target.checked })}
                        checked={pronouns.he}
                        disabled={!isEditable}
                    />
                    <label htmlFor="He">He</label>
                    </div>
                    <div>
                    <input className="mr-1" type="checkbox" id='they/them' name="they/them" placeholder='they/them'
                        onChange={(e) => setPronouns({ ...pronouns, theyThem: e.target.checked })}
                        checked={pronouns.theyThem}
                        disabled={!isEditable}
                    />
                    <label htmlFor="they/them">They/Them</label>
                    </div>

                </div>
               
                <label className='mr-1 ml-5 text-sm' htmlFor="other">Other:</label>
                <input className="border disabled:text-gray-300 rounded w-12 capitalize" type="text" id='other' name="other" placeholder=''
                    onChange={(e) => setPronouns({ ...pronouns, other: e.target.value })}
                    value={pronouns.other}
                    disabled={!isEditable}
                />
            </div>
            <div className=''>
                <label htmlFor="bio">Bio:</label> 
                <br />
                <textarea className='border resize-none w-full h-36 rounded p-1 text-sm disabled:text-gray-400' id='bio' name="bio" placeholder='Write a short bio about yourself'
                    onChange={(e) => setBio(e.target.value)}
                    value={bio}
                    disabled={!isEditable}
                    maxLength={500}
                ></textarea>
                <span className='text-xs text-gray-400'>{bio.length === 500 ? "500/500 Max length reached" : `${bio.length}/500`}</span>
            </div>
            <div className='flex flex-col'>
                <label htmlFor="links">Website Link:</label>
                <input className="border p-1 rounded disabled:text-gray-400" type="url" id='links' name="links"         placeholder='Links'
                    onChange={(e) => setLinks(e.target.value)}
                    value={links}
                    disabled={!isEditable}
                />

            </div>
            {
                isEditable ? (
                    <div className='flex w-full justify-end text-sm'>
                    <button onClick={handleSubmit}
                        className='bg-blue-950 text-white px-2 py-1 rounded cursor-pointer' type='submit'>Save</button>
                    <button onClick={() => { setIsEditable(false);
                        setDisplayName(username?.displayName || '');
                        setPronouns({ she: pronouns.she, he: pronouns.he, theyThem: pronouns.theyThem, other: pronouns.other });
                        setBio(bio || '');
                        setLinks(links || '');
                     }}
                        className='bg-gray-300 cursor-pointer px-2 py-1 rounded ml-2' type='button'>Cancel</button>
                    </div>
                )
                    :
                    (<button onClick={handleEdit}
                        className='bg-gray-300 cursor-pointer p-1 rounded' type='button'>Edit</button>
                    )
            }

        </div>

    )
}

export default BioAndLinks