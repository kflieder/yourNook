'use client'
import { createBlog } from '@/utilities/blogs/createBlogHelper';
import React, { useState } from 'react'
import blogTopicData from '@/utilities/blogs/blogTopicData.json'
import CustomTopicSelectDropdown from './CustomTopicSelectDropdown';

interface BlogFormProps {
    authorId: string;
    authorDisplayName: string;
}

function BlogForm({ authorId, authorDisplayName }: BlogFormProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [topic, setTopic] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (content.length < 300) { 
        setError('Content must be at least 300 characters long.');
        return;
      }
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
            setTopic('');
        } catch (error) {
            console.error("Error creating blog:", error);
        }
    };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col border border-gray-300 rounded space-y-4 p-4 w-full bg-white h-[50vh]'>
      <input
        className='border p-2 rounded bg-gray-100 border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-400'
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />
        {/* <select required={true} id="topics" name="topics" className='border p-2 rounded bg-gray-100 border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-400'
        value={topic} onChange={(e) => setTopic(e.target.value)}
        >
          <option value="" disabled hidden>Select a topic</option>
          {blogTopicData.map((blogTopic) => (
            <option className="border" key={blogTopic.topic} value={blogTopic.topic} style={{ backgroundColor: blogTopic.textBackground }}>
          
              {blogTopic.topic}
              
            </option>
          ))}
        </select> */}
        <CustomTopicSelectDropdown onSelectTopic={setTopic} selectedTopic={topic} />
        <textarea
        className='border border-gray-300 p-2 rounded resize-none bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-400'
        rows={15}
        placeholder="Write your little heart out <3"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={15000}
        />
        <div className='flex flex-col items-center gap-1'>
          <span className='text-xs'>{`${content.length < 300 ? `Must be at least ${300 - content.length} characters` : `${content.length}/15,000`}`}</span>
          <button disabled={content.length < 300 || !topic || title.length === 0} className='bg-blue-950 text-white px-2 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed' type="submit">Create Blog</button>
        </div>
        {error && <p className='text-red-500'>{error}</p>}

        {/* <input
        type="file"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        /> */}
        
    </form>
  )
}

export default BlogForm
