"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { registerAction } from "./actions";

export default function RegisterPage() {
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">

      {/* Background Glow */}
      <div className="absolute w-72 h-72 bg-blue-400/20 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl bottom-10 right-10"></div>

      <div className="relative w-full max-w-2xl">

        <div className="backdrop-blur-lg bg-white/70 border border-white/40 shadow-xl rounded-3xl p-8">

          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <div className="relative">

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100 flex items-center justify-center">

                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-slate-400"
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
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition"
              >
                +
              </button>

            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">
            Register for VendorBridge
          </h2>

          <form action={registerAction} className="space-y-4">

            {/* First Name + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

            </div>

            {/* Role + Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role
                </label>

                <select
                  name="role"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Role</option>
                  <option value="Procurement Officer">
                    Procurement Officer
                  </option>
                  <option value="Vendor">
                    Vendor
                  </option>
                  <option value="Manager">
                    Manager
                  </option>
                  <option value="Admin">
                    Admin
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Country
                </label>

                <input
                  type="text"
                  name="country"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Additional Information
              </label>

              <textarea
                name="additionalInfo"
                rows={5}
                placeholder="Enter additional information..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Register Button */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="px-10 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                Register
              </button>


            </div>

          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-slate-600">
            Already registered?{" "}
            <Link
              href="/login"
              className="text-indigo-600 hover:underline"
            >
              Log in
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}