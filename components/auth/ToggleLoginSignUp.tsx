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
    <div className="bg-gray-300 p-6 pb-2 rounded-lg shadow-md flex flex-col items-center">
        {
            isSignup ? 
            <SignupForm /> :
            <LoginForm />
        }
        <button 
            className='cursor-pointer bg-blue-950 text-white rounded p-2 m-2'
            onClick={toggleForm}>
            {isSignup ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </button>
    </div>
  )
}

export default ToggleLoginSignUp