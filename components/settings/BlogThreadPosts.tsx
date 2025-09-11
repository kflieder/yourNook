'use client';
import React, { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '@/context/AuthContext';

const contentTypeLabels: { [key: string]: string } = {
  posts: "Posts",
  blog: "Blogs",
  thread: "Threads",
};

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
   

    const editButton = (
        <div>
            {
                isEditable ? (
                    <button className="cursor-pointer text-sm px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400" onClick={handleSubmit}>Save</button>
                ) : (
                    <button className="cursor-pointer text-sm px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400" onClick={handleEdit}>Edit</button>
                )
            }
        </div>
    )

    return (
        <div className='flex flex-col border-2 border-blue-950 p-8 rounded bg-white'>
            <div className="flex justify-between w-full text-xl items-center">
                <h2>What content would you like to create?</h2>
                {editButton}
            </div>

            <div className='flex text-lg pl-5 mb-8'>
                <input className='mr-2' type="checkbox" id="posts" name="posts" onChange={() => handleContentTypeChange('posts')} disabled={!isEditable} checked={contentType.includes('posts')} />
                <label className='mr-4' htmlFor="posts">Posts</label>
                
                <input className='mr-2' type="checkbox" id="blog" name="blog" onChange={() => handleContentTypeChange('blog')} disabled={!isEditable} checked={contentType.includes('blog')} />
                <label  className='mr-4' htmlFor="blog">Blogs</label>
               
                <input className='mr-2' type="checkbox" id="thread" name="thread" onChange={() => handleContentTypeChange('thread')} disabled={!isEditable} checked={contentType.includes('thread')} />
                <label htmlFor="thread">Threads</label>
        
            </div>
            <div className=''>
                <h2 className='text-xl'>Which would you like as the default view on your profile?</h2>
                <div className='flex pl-2 gap-1'>
                    {
                        contentType.map((type) => (
                            <div key={type} className="flex text-lg capitalize">
                                <input className='mr-1' type="radio" id={`radio-${type}`} name="contentType" onChange={() => setDefaultContentType(type)} disabled={!isEditable} checked={defaultContentType === type} />
                                <label className='mr-4' key={type} htmlFor={type}>{contentTypeLabels[type]}</label>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default BlogThreadPosts