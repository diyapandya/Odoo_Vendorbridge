"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/actions/auth";
import Link from "next/link";

function VerifyEmailContent() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Missing token!");
      return;
    }

    verifyEmail(token)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success);
        }
        if (data.error) {
          setError(data.error);
        }
      })
      .catch(() => setError("Something went wrong!"));
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Email Verification
        </h2>
        
        {!success && !error && (
          <p className="text-gray-500">Verifying your email...</p>
        )}
        
        {success && (
          <div className="text-green-600 font-medium">
            <p>{success}</p>
            <Link href="/login" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500 underline">
              Back to login
            </Link>
          </div>
        )}
        
        {error && (
          <div className="text-red-600 font-medium">
            <p>{error}</p>
            <Link href="/login" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500 underline">
              Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
