import Link from 'next/link';
import { loginAction } from './actions';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-slate-100">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6 text-center">
          Sign in to VendorBridge
        </h2>
        <form action={loginAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email Address</label>
            <input type="email" name="email" required className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" name="password" required className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md" />
          </div>
          <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium">
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-600">
          New here? <Link href="/register" className="text-indigo-600 hover:underline">Create an account</Link>
        </div>
      </div>
    </div>
  );
}