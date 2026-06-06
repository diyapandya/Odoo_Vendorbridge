"use server";

import { redirect } from 'next/navigation';

export async function registerAction(formData: FormData) {
  // Extract parameters and validate
  // Insert new user into database
  
  redirect('/login');
}