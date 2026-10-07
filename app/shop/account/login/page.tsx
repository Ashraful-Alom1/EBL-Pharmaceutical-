"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { auth } from "@/lib/firebase-client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

export default function StoreLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Signed in successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "/shop";
      }, 1000);
    } catch (err: unknown) {
      const e = err as { message: string };
      setError(e.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!email || !password) {
      setError("Please provide both email and password to create an account.");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("Account created successfully! Welcome to Eastern Biochemicals Store.");
      setTimeout(() => {
        window.location.href = "/shop";
      }, 1200);
    } catch (err: unknown) {
      const e = err as { message: string };
      setError(e.message || "Failed to create account. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address to receive password reset instructions.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(`Password reset email sent to ${email}. Check your inbox.`);
    } catch (err: unknown) {
      const e = err as { message: string };
      setError(e.message || "Failed to send reset email.");
    }
  };

  return (
    <div className="py-20 px-4 max-w-md mx-auto text-center pb-32">
      {/* Title */}
      <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-8">
        Login
      </h1>

      {/* Notifications */}
      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form matching PDF page 8 layout */}
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full text-xs p-3.5 rounded-full border border-gray-200 bg-white outline-none focus:border-[#E01B47] px-5"
          />
        </div>

        <div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full text-xs p-3.5 rounded-full border border-gray-200 bg-white outline-none focus:border-[#E01B47] px-5"
          />
        </div>

        <div className="text-left px-2">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-xs text-gray-500 hover:text-[#E01B47] underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Two buttons side by side matching PDF page 8 */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#E01B47] hover:bg-[#C4153C] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={handleCreateAccount}
            disabled={loading}
            className="border-2 border-[#E01B47] text-[#E01B47] hover:bg-rose-50 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
          >
            Create account
          </button>
        </div>
      </form>

      {/* Return to Store link */}
      <div className="mt-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#E01B47] font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Store
        </Link>
      </div>
    </div>
  );
}
