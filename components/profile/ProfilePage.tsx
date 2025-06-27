'use client';
import React from 'react'
import { useAuth } from '@/context/AuthContext';
import Bio from './Bio';
import CreatePost from './CreatePost';
import UserPosts from './UserPosts';

interface ProfilePageProps {
    userData: {
      displayName: string;
      pronouns?: {
        she?: boolean;
        he?: boolean;
        theyThem?: boolean;
        other?: string;
      };
      bio?: string;
      links?: string;
      uniqueUrl?: string;
      profilePicture?: string;
        uid?: string;
    };
    posts: Array<{
        id: string;
        [key: string]: any;
    }>;
  }



function ProfilePage({ userData, posts }: ProfilePageProps) {
    const { username } = useAuth();
    const isOwner = username?.uid === userData.uid;
  return (
    <div>
        <Bio userData={userData} />
        {isOwner && <CreatePost />}
        <UserPosts posts={posts} />
    </div>
  )
}

export default ProfilePage