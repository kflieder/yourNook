"use client";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../lib/firebase";
import React, { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      alert("Login failed. Please check your email and password.");
    }
  }

  return (
    <div>
      <div className="flex flex-col border border-gray-300 justify-center items-center bg-white p-2 sm:p-6 rounded-lg shadow-md">
        <input
          className="border w-56 m-1 rounded p-1"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border w-56 m-2 rounded p-1"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
        disabled={!email || !password}
          className="cursor-pointer bg-blue-950 w-56 text-white rounded p-1 m-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
          onClick={(e) => {
            console.log("Logging in with:", { email, password });
            handleLogin(e);
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
