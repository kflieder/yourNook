import React,{ useState } from 'react'
import { createDiscussionThread } from '@/utilities/threads/createDiscussionThreadHelper';

function DiscussionThreadForm({ currentUserUid, currentUserDisplayName }: {
  currentUserUid: string;
  currentUserDisplayName: string;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDiscussionThread({
        title,
        content,
        authorId: currentUserUid, 
        authorDisplayName: currentUserDisplayName, 
      });
      setTitle('');
      setContent('');
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  return (
    <div className='border'>
      <h2>Create a New Thread</h2>
      <form onSubmit={handleSubmit}> 
        <div>
          <label className='border' htmlFor="title">Title:</label>
          <input className='border' type="text" id="title" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className='border' htmlFor="content">Content:</label>
          <textarea className='border' id="content" name="content" required value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        </div>
        <button className='border cursor-pointer' type="submit">Submit</button>
      </form>
    </div>
  )
}

export default DiscussionThreadForm;
