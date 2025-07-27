import React, { useState } from "react";
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
  const [expandedBlog, setExpandedBlog] = useState<string | null>(null);

  const handleExpandBlog = (blogId: string) => {
    setExpandedBlog((prev) => (prev === blogId ? null : blogId));
  };
  return (
    <div className="grid grid-cols-2 gap-4 p-4 relative">
      {loading && <p>Loading...</p>}
      {!loading && blogs.length === 0 && <p>No blogs found.</p>}
      {blogs.map((blog) => (
        <div
          key={blog.id}
          onClick={() => handleExpandBlog(blog.id)}
          className={`cursor-pointer flex flex-col justify-between items-center border-2 rounded overflow-hidden shadow-2xl transition-all duration-300 ${
            expandedBlog === blog.id
              ? "absolute top-0 left-0 w-full z-50 bg-gray-100 h-124 justify-start"
              : "relative bg-white"
          }`}
        >
          <h2
            className={`font-bold text-md capitalize px-4 pt-4 text-center ${
              expandedBlog === blog.id ? "text-2xl pb-2" : "text-md"
            }`}
          >
            {blog.title}
          </h2>
          <div className="border w-3/4"></div>
          <p
            className={`${
              expandedBlog === blog.id
                ? "h-124 overflow-y-auto pt-6 px-10 whitespace-pre-wrap break-word"
                : "h-24 overflow-hidden p-2"
            }`}
          >
            {blog.content}
          </p>

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
