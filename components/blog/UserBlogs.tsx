import React from 'react'
import BlogForm from './BlogForm';

interface UserBlogsProps {
  authorId: string;
    authorDisplayName: string;
}

function UserBlogs({ authorId, authorDisplayName }: UserBlogsProps) {
  return (
    <div>
      <BlogForm
        authorId={authorId}
        authorDisplayName={authorDisplayName}
        />
    </div>
  )
}

export default UserBlogs
