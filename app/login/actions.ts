"use server";

import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // Perform login logic via database service
  // Set cookies / session tokens

  redirect('/dashboard');
}