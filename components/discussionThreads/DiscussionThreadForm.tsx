import React,{ useState } from 'react'
import { createDiscussionThread } from '@/utilities/threads/createDiscussionThreadHelper';

function DiscussionThreadForm({ currentUserUid, currentUserDisplayName }: {
  currentUserUid: string;
  currentUserDisplayName?: string;
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
        authorDisplayName: currentUserDisplayName || "",
      });
      setTitle('');
      setContent('');
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  return (
    <div className='border border-gray-300 rounded bg-white p-4'>
      
      <form className='flex flex-col gap-4 border border-gray-300 rounded p-4' onSubmit={handleSubmit}> 
        <div>
          <input className='border rounded px-2 bg-gray-100 w-full' placeholder='Title' type="text" id="title" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <textarea placeholder='Prompt' className='border px-2 rounded bg-gray-100 w-full resize-none' id="content" name="content" required value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        </div>
        <button className='border cursor-pointer' type="submit">Submit</button>
      </form>
      
    </div>
  )
}

export default DiscussionThreadForm;
