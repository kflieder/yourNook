'use client';
import React, { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import {useRouter} from 'next/navigation';
import { useUserDoc } from '@/utilities/getUserDocHelper';

function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const router = useRouter();

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: username
                
            });
            const userDoc = useUserDoc(userCredential.user.uid);
            await userDoc.setUserData({
                displayName: username,
                uniqueUrl: username.toLowerCase().replace(/\s+/g, '-'),
                pronouns: {other: 'other'},
                bio: 'Please edit your profile ',
                links: 'edit profile',
                profilePicture: '/profileAvatar.png',
                uid: userCredential.user.uid
            });
            router.push('/profile/' + username.toLowerCase().replace(/\s+/g, '-'));
        } catch (error) {
            console.log("Error signing up:", error);
        }
    }

    return (
        <div>
            <div className='flex flex-col border justify-center items-center'>
                <input className="border w-56 m-2 rounded p-4" type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input className="border w-56 m-2 rounded p-4" type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input className="border w-56 m-2 rounded p-4" type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input className="border w-56 m-2 rounded p-4" type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                    className='cursor-pointer bg-blue-500 text-white rounded p-2 m-2'
                    onClick={(e) => {
                        if (password !== confirmPassword) {
                            alert("Passwords do not match!");
                            return;
                        }
                        handleSignup(e);

                        console.log("Signing up with:", { username, email, password });
                    }}>Sign Up</button>
                {/* <p>Already have an account? <a href="/login">Login</a></p> */}

            </div>
        </div>
    )
}

export default SignupForm