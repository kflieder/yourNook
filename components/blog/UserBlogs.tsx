import React from 'react'
import { useGetBlog } from 'src/utilities/blogs/useGetBlog';

interface UserBlogsProps {
    authorId: string;
    authorDisplayName: string;
    profilePicture: string;
}

function UserBlogs({ authorId, authorDisplayName, profilePicture }: UserBlogsProps) {
  const { blogs, loading } = useGetBlog(authorId);
  return (
    <div className='grid grid-cols-2 gap-4 p-4'>

      {loading && <p>Loading...</p>}
      {!loading && blogs.length === 0 && <p>No blogs found.</p>}
      {blogs.map((blog) => (
        <div key={blog.id} className='border p-4 mb-4 rounded h-64 overflow-hidden'>
          <div className='flex items-center space-x-2 mb-4'>
          {profilePicture && <img className='w-12 h-12 rounded-full border-3' src={profilePicture} alt={`${authorDisplayName}'s profile`} />}
          <p>Author: {authorDisplayName}</p>
          </div>
          <h2 className='font-bold text-lg capitalize'>{blog.title}</h2>
          <p>{blog.content}</p>
          <p>Created at: {blog.createdAt.toLocaleDateString()}</p>
          {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title} />}
        </div>
      ))}
    </div>
  )
}

export default UserBlogs
