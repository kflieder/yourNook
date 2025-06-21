'use client';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import React, { useState } from 'react'

function ToggleLoginSignUp() {
    const [isSignup, setIsSignup] = useState(true);

    function toggleForm() {
        setIsSignup(!isSignup);
        console.log(isSignup)
    }

  return (
    <div>
        {
            isSignup ? 
            <SignupForm /> :
            <LoginForm />
        }
        <button 
            className='cursor-pointer bg-blue-500 text-white rounded p-2 m-2'
            onClick={toggleForm}>
            {isSignup ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </button>
    </div>
  )
}

export default ToggleLoginSignUp