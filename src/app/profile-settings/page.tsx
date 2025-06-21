'use client'
import React, { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import BlogThreadPosts from '../../../components/settings/BlogThreadPosts'

function page() {
    const { username, loading }: any = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !username?.uid) {
            router.push('/');
        }
    }, [username, router]);
  return (
    <div>
        <BlogThreadPosts />
    </div>
  )
}

export default page