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
    <div>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        />
        <input 
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        />
        <button onClick={handleSubmit}>Create Blog</button>
    </div>
  )
}

export default BlogForm
