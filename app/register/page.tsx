import Link from 'next/link';
import { registerAction } from './actions';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-slate-100">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6 text-center">
          Register for VendorBridge
        </h2>
        <form action={registerAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name</label>
            <input type="text" name="name" required className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email Address</label>
            <input type="email" name="email" required className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Phone</label>
            <input type="tel" name="phone" required className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Role</label>
            <select name="role" required className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md bg-white">
              <option value="Procurement Officer">Procurement Officer</option>
              <option value="Vendor">Vendor</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Country</label>
            <input type="text" name="country" required className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md" />
          </div>
          <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium">
            Register
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-600">
          Already registered? <Link href="/login" className="text-indigo-600 hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}