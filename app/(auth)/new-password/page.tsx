"use client";

import { useState, Suspense } from "react";
import { resetPassword } from "@/actions/auth";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function NewPasswordContent() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      setError("Missing token!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;

    const result = await resetPassword(token, password);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(result.success);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
    
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Enter new password
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="password" className="sr-only">New Password</label>
              <input id="password" name="password" type="password" required className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="New Password" />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm text-center">{success}</div>}

          <div>
            <button type="submit" disabled={loading} className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50">
              {loading ? "Updating..." : "Reset password"}
            </button>
          </div>
          
          <div className="text-sm text-center mt-4">
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPasswordContent />
    </Suspense>
  );
}
