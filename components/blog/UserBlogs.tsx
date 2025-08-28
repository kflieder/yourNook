import React, { useState } from "react";
import { useGetBlog } from "src/utilities/blogs/useGetBlog";
import BlogStyle from "./BlogStyle";

interface UserBlogsProps {
  authorId: string;
  authorDisplayName: string;
  profilePicture: string;
  currentUser: string;
  currentUserDisplayName: string;
}

function UserBlogs({
  authorId,
  authorDisplayName,
  profilePicture,
  currentUser,
  currentUserDisplayName
}: UserBlogsProps) {
  const { blogs, loading } = useGetBlog(authorId);
 
  console.log(blogs, "Blogs in UserBlogs component");
 
  return (
    <div className="flex flex-col gap-4 p-4 relative">
      {loading && <p>Loading...</p>}
      {!loading && blogs.length === 0 && <p>No blogs found.</p>}
      {blogs.map((blog) => {
        console.log("Blog:", blog);
        return (
        
        <div key={blog.id}>
          <BlogStyle
            id={blog.id}
            title={blog.title}
            content={blog.content}
            imageUrl={blog.imageUrl}
            createdAt={blog.createdAt}
            authorDisplayName={authorDisplayName}
            profilePicture={profilePicture}
            currentLikes={blog.likes}
            currentUser={currentUser}
            currentUserDisplayName={currentUserDisplayName}
            authorUid={authorId}
            topic={blog.topic}
          />
        </div>
      )}
      )}
    </div>
  );
}

export default UserBlogs;
