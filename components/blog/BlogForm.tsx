'use client'
import { createBlog } from '@/utilities/blogs/createBlogHelper';
import React, { useState } from 'react'

interface BlogFormProps {
    authorId: string;
    authorDisplayName: string;
}

function BlogForm({ authorId, authorDisplayName }: BlogFormProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createBlog({
                title,
                content,
                imageUrl,
                authorId,
                authorDisplayName
            });
            // Reset form fields after successful submission
            setTitle('');
            setContent('');
            setImageUrl('');
        } catch (error) {
            console.error("Error creating blog:", error);
        }
    };

  return (
    <div className='flex flex-col space-y-4 p-4 w-full'>
      <input
        className='border p-2 rounded'
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
        className='border p-2 rounded'
        rows={15}
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        />
        {/* <input 
        type="file"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        /> */}
        <button className='bg-blue-500 text-white p-2 rounded' type="submit"
         onClick={handleSubmit}>Create Blog</button>
    </div>
  )
}

export default BlogForm
