'use client'
import { createBlog } from '@/utilities/blogs/createBlogHelper';
import React, { useState } from 'react'
import blogTopicData from '@/utilities/blogs/blogTopicData.json'

interface BlogFormProps {
    authorId: string;
    authorDisplayName: string;
}

function BlogForm({ authorId, authorDisplayName }: BlogFormProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [topic, setTopic] = useState('');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createBlog({
                title,
                content,
                imageUrl,
                authorId,
                authorDisplayName,
                topic
            });
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
        <label htmlFor='topics'>Select a Topic</label>
        <select id="topics" name="topics" className='border p-2 rounded'
        value={topic} onChange={(e) => setTopic(e.target.value)}
        >
          <option value="">Select a topic</option>
          {blogTopicData.map((blogTopic) => (
            <option className="" key={blogTopic.topic} value={blogTopic.topic} style={{ backgroundColor: blogTopic.textBackground }}>
              {blogTopic.topic}
            </option>
          ))}
        </select>
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
