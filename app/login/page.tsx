"use client";

import Link from "next/link";
import { useState, useRef } from "react";

export default function LoginPage() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">

      {/* Background Glow */}
      <div className="absolute w-72 h-72 bg-blue-400/20 rounded-full blur-3xl top-20 left-10"></div>
      <div className="absolute w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl bottom-10 right-10"></div>

      <div className="relative w-full max-w-md">

        <div className="backdrop-blur-lg bg-white/70 border border-white/40 shadow-xl rounded-3xl p-8">

          {/* Profile Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative">

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100 flex items-center justify-center">

                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 1115 0"
                    />
                  </svg>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
            Login for VendorBridge

          </h2>

          <p className="text-center text-slate-500 text-sm mb-6">
            Welcome back to VendorBridge ERP
          </p>

          {/* Form */}
          <form className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Username
              </label>

              <input
                type="text"
                placeholder="Enter username"
                className="mt-1 w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                className="mt-1 w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-between items-center text-sm">

              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" />
                Remember Me
              </label>

              <Link
                href="/forgot-password"
                className="text-indigo-600 hover:text-indigo-700"
              >
                Forgot Password?
              </Link>

            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-lg hover:scale-[1.01] transition-all"
            >
              Sign In
            </button>

          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            New here?{" "}
            <Link
              href="/register"
              className="text-indigo-600 hover:underline"
            >
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}