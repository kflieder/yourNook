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
      <div className="flex flex-col border justify-center items-center">
        <input
          className="border w-56 m-2 rounded p-4"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border w-56 m-2 rounded p-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="cursor-pointer bg-blue-500 text-white rounded p-2 m-2"
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
