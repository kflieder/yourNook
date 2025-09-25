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
    <div className="bg-gray-300 p-4 pb-1 text-sm rounded-lg shadow-md flex flex-col items-center w-3/4 sm:w-full">
        {
            isSignup ? 
            <SignupForm /> :
            <LoginForm />
        }
        <button 
            className='cursor-pointer bg-blue-950 text-white rounded p-2 m-2'
            onClick={toggleForm}>
            {isSignup ? (
  <span>Already have an account? Sign In</span>
) : (
  <span>
    Need an account? <br />
    Sign Up
  </span>
)}
        </button>
    </div>
  )
}

export default ToggleLoginSignUp