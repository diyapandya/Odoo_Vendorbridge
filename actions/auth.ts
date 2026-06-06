"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { generateVerificationToken, generatePasswordResetToken } from "@/lib/tokens";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/mail";

export const registerUser = async (data: any) => {
  try {
    const { email, password, firstName, lastName, phone, role, country } = data;

    if (!email || !password || !firstName || !lastName) {
      return { error: "Missing required fields" };
    }

    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        phone: phone || "",
        role: role || "Vendor",
        country: country || "Unknown",
      }
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Confirmation email sent!" };
  } catch (error) {
    console.error("Registration Error", error);
    return { error: "Something went wrong!" };
  }
};

export const verifyEmail = async (token: string) => {
  const existingToken = await db.verificationToken.findUnique({
    where: { token }
  });

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await db.user.findUnique({
    where: { email: existingToken.email }
  });

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: { 
      emailVerified: new Date(),
      email: existingToken.email
    }
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Email verified!" };
};

export const resetPasswordRequest = async (email: string) => {
  const existingUser = await db.user.findUnique({
    where: { email }
  });

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

  return { success: "Reset email sent!" };
};

export const resetPassword = async (token: string, password: string) => {
  const existingToken = await db.passwordResetToken.findUnique({
    where: { token }
  });

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await db.user.findUnique({
    where: { email: existingToken.email }
  });

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword }
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Password updated!" };
};
