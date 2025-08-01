'use client';
import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';


function CreatePost() {
    const { username } = useAuth();
    const [content, setContent] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);

 async function handleCreatePost(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let mediaUrl = '';
        
        if (mediaFile) {
            const fileRef = ref(storage, `posts/${Date.now()}_${mediaFile.name}`);
            const snapShot = await uploadBytes(fileRef, mediaFile);
            mediaUrl = await getDownloadURL(snapShot.ref);
        }

        if (!username) {
            alert('You must be logged in to create a post.');
            return;
        }

        try {
            console.log("Attempting to create post with data:", {
                uid: username.uid,
                displayName: username.displayName,
                content,
                mediaUrl,
              });
            await addDoc(collection(db, 'posts'), {
                uid: username.uid,
                displayName: username.displayName,
                content: content,
                createdAt: Timestamp.fromDate(new Date()),
                uniqueUrl: username?.uniqueUrl || '',
                profilePicture: username.profilePicture || '',
                likes: [],
                comments: [],
                shares: 0,
                isEdited: false,
                isDeleted: false,
                isReported: false,
                reportCount: 0,
                mediaUrl,
            });
            setContent('');
            setMediaFile(null);
            console.log('Post was added to Firestore!');
            alert('Post created successfully!');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post. Please try again later.');
        }
    }
    console.log(username, "Username from Auth Context");

    return (
        <div>
            <form onSubmit={handleCreatePost} className="flex flex-col p-4 border rounded-lg">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="p-2 border rounded-lg mb-4"
                    rows={4}
                    maxLength={500} // Limit to 500 characters
                />
                <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => {
                        if (e.target.files) {
                            setMediaFile(e.target.files?.[0] || null); // Use the first file if multiple files are selected
                        }
                    }}
                    className="mb-4"
                />
                
        
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Create Post
                </button>
            </form>


        </div>
    )
}

export default CreatePost       