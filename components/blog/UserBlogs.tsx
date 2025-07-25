import React from "react";
import { useGetBlog } from "src/utilities/blogs/useGetBlog";

interface UserBlogsProps {
  authorId: string;
  authorDisplayName: string;
  profilePicture: string;
}

function UserBlogs({
  authorId,
  authorDisplayName,
  profilePicture,
}: UserBlogsProps) {
  const { blogs, loading } = useGetBlog(authorId);
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {loading && <p>Loading...</p>}
      {!loading && blogs.length === 0 && <p>No blogs found.</p>}
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="flex flex-col justify-between items-center border-2 rounded h-54 overflow-hidden shadow-2xl"
        >
          <h2 className="font-bold text-md capitalize px-4 pt-4">{blog.title}</h2>
          <div className="border w-3/4"></div>
          <p className="h-24 overflow-hidden px-4">{blog.content}</p>
          
          {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title} />}
          <div className="flex items-center space-x-2 border-t p-2 bg-gray-300 w-full">
            {profilePicture && (
              <img
                className="w-12 h-12 rounded-full border-2"
                src={profilePicture}
                alt={`${authorDisplayName}'s profile`}
              />
            )}
            <p>By: {authorDisplayName}</p>
            <p>Created at: {blog.createdAt.toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserBlogs;
