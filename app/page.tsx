import { redirect } from 'next/navigation';

export default function HomePage() {
  // Check session and redirect accordingly
  redirect('/dashboard');
}