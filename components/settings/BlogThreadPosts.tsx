'use client';
import React, { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '@/context/AuthContext';

function BlogThreadPosts() {
    const [contentType, setContentType] = useState<string[]>([]);
    const [defaultContentType, setDefaultContentType] = useState<string>('posts');
    const { username }: any = useAuth();
    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        async function fetchSettings() {
            if (!username?.uid) return;

            const userRef = doc(db, 'users', username.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.contentType) setContentType(data.contentType);
                if (data.defaultContentType) setDefaultContentType(data.defaultContentType);
            }
        }
        fetchSettings();
    }, [username]);


    async function handleSubmit() {
        const userRef = doc(db, 'users', username.uid);

        await setDoc(userRef, {
            contentType,
            defaultContentType
        }, { merge: true })
        console.log(username.uid);
        setIsEditable(false);
        alert('Settings saved successfully!');    
    }

    function handleEdit() {
        setIsEditable(true)
    }

    function handleContentTypeChange(type: string) {
        setContentType(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        )
    }
    console.log(defaultContentType);
    console.log(contentType);

    return (
        <div>
            <input className='mr-2' type="checkbox" id="posts" name="posts" onChange={() => handleContentTypeChange('posts')} disabled={!isEditable} checked={contentType.includes('posts')} />
            <label htmlFor="posts">Posts</label>
            <br />
            <input className='mr-2' type="checkbox" id="blog" name="blog" onChange={() => handleContentTypeChange('blog')} disabled={!isEditable} checked={contentType.includes('blog')}/>
            <label htmlFor="blog">Blogs</label>
            <br />
            <input className='mr-2' type="checkbox" id="thread" name="thread" onChange={() => handleContentTypeChange('thread')} disabled={!isEditable} checked={contentType.includes('thread')}/>
            <label htmlFor="thread">Threads</label>
            <br />
            <div className='flex'>
            {
                contentType.map((type) => (
                    <div key={type} className="flex border">
                        <input className='mr-2' type="radio" id={`radio-${type}`} name="contentType" onChange={() => setDefaultContentType(type)} disabled={!isEditable} checked={defaultContentType === type}/>
                        <label key={type} htmlFor={type}>{type}</label>
                    </div>
                ))
            }
            </div>
            <br />
            {
                isEditable ? (
                    <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={handleSubmit}>Save</button>
                ) : (
                    <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={handleEdit}>Edit</button>
                )
            }
        </div>
    )
}

export default BlogThreadPosts