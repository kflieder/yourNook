import React, { useState, useRef } from 'react'
import {auth} from '../../../lib/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useAlert } from 'components/customAlertModal/AlertProvider';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const { show } = useAlert();
    const alertRef = useRef<HTMLDivElement>(null);

    const handleResetPassword = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            show("Please enter a valid email address.", { bottom: 60, right: 60 }, alertRef);
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            setEmail("");
            show("Password reset email sent successfully! Make sure to check your spam folder if it isn't in your inbox.", { bottom: 60, left: 60 }, alertRef);
        } catch (error) {
            console.error("Error resetting password:", error);
        }
    }

  return (
    <div ref={alertRef} className='flex flex-col gap-4 justify-center items-center w-full sm:w-1/2 p-4 border rounded bg-white'>
      <h1>Forgot Password</h1>
      <p>Please enter your email address to reset your password.</p>
      <input className='border rounded p-1' type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button  disabled={!email} onClick={handleResetPassword} className='bg-blue-950 text-white rounded p-1 cursor-pointer'>Reset Password</button>
    </div>
  )
}

export default ForgotPassword
