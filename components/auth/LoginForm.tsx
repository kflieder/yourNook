"use client";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../lib/firebase";
import React, { useState, useRef } from "react";
import { useAlert } from "components/customAlertModal/AlertProvider";
import ForgotPassword from "components/settings/security/ForgotPassword";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { show } = useAlert();
  const alertref = useRef<HTMLDivElement>(null);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken(true);

      await updateProfile(userCredential.user, {
        displayName: userCredential.user.displayName || "User",
      });
      await fetch("/api/sessionLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });
    } catch (error) {
      console.log("error logging in:", error);
      show(
        "Login failed. Please check your email and password and try again.",
        { bottom: 45, right: 0 },
        alertref
      );
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleLogin(e as unknown as React.FormEvent);
    }
  }

  function handleToggleForgotPwForm() {
    setShowForgotPasswordForm(!showForgotPasswordForm);
  }
  console.log(showForgotPasswordForm);

  return (
    <div ref={alertref}>
      {showForgotPasswordForm ? (
        <>
          <ForgotPassword />
          <span
            className="border w-full flex justify-center bg-white rounded mt-2 cursor-pointer"
            onClick={handleToggleForgotPwForm}
          >
            Nevermind, I remembered :D
          </span>
        </>
      ) : (
        <div className="flex flex-col border border-gray-300 justify-center items-center bg-white p-2 sm:p-6 rounded-lg shadow-md">
          <input
            className="border w-56 m-1 rounded p-1 md:p-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border w-56 m-2 rounded p-1 md:p-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            disabled={!email || !password}
            className="cursor-pointer bg-blue-950 w-56 text-white rounded p-1 m-1 text-sm sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
            onClick={(e) => {
              console.log("Logging in with:", { email, password });
              handleLogin(e);
            }}
          >
            Login
          </button>
          <span
            onClick={handleToggleForgotPwForm}
            className="text-sm cursor-pointer"
          >
            forgot password
          </span>
        </div>
      )}
    </div>
  );
}

export default LoginForm;
