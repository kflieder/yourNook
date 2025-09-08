import React,{ useState } from 'react'
import { createDiscussionThread } from '@/utilities/threads/createDiscussionThreadHelper';
import CustomTopicSelectDropdown from 'components/topics/CustomTopicSelectDropdown';

function DiscussionThreadForm({ currentUserUid, currentUserDisplayName }: {
  currentUserUid: string;
  currentUserDisplayName?: string;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDiscussionThread({
        title,
        content,
        authorId: currentUserUid,
        authorDisplayName: currentUserDisplayName || "",
        topic
      });
      setTitle('');
      setContent('');
      setTopic('');
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  return (
    <div className='border border-gray-300 rounded bg-white p-4'>

      <form className='flex flex-col gap-4 border border-gray-300 rounded p-4' onSubmit={handleSubmit}>
        <CustomTopicSelectDropdown selectedTopic={topic} onSelectTopic={setTopic} />
        <div>
          <input className='border border-gray-300 rounded px-2 bg-gray-100 w-full' placeholder='Title' type="text" id="title" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
        </div>
        <div>
          <textarea placeholder='Prompt' className='border border-gray-300 px-2 rounded bg-gray-100 w-full resize-none' id="content" name="content" required value={content} onChange={(e) => setContent(e.target.value)} maxLength={500}></textarea>
        </div>
        <div className='w-full flex justify-end items-center gap-x-2'>
          <p className='text-xs'>{content.length}/500</p>
          <button disabled={!content || !topic} className='w-1/4 text-sm rounded-full cursor-pointer bg-blue-950 text-white disabled:cursor-not-allowed disabled:opacity-50' type="submit">Submit</button>
        </div>
      </form>
      
    </div>
  )
}

export default DiscussionThreadForm;
