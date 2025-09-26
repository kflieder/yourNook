import React, { useState, useEffect } from "react";
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
  const [expandedBlog, setExpandedBlog] = useState(false);


  useEffect(() => {
    if (expandedBlog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [expandedBlog]);

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      {loading && <p>Loading...</p>}
      {!loading && blogs.length === 0 && <p>No blogs found.</p>}
      {blogs.map((blog) => {
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
            currentUser={currentUser || null}
            currentUserDisplayName={currentUserDisplayName || ''
            }
            authorUid={authorId}
            topic={blog.topic}
            onExpandChange={(expanded) => {
              setExpandedBlog(expanded);
            }}
            styleSelector="userProfile"
          />
        </div>
      )}
      )}
    </div>
  );
}

export default UserBlogs;
