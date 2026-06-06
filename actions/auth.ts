"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { generateVerificationToken, generatePasswordResetToken } from "@/lib/tokens";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/mail";

import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const registerUser = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const role = formData.get("role") as string;
    const country = formData.get("country") as string;
    const profilePicFile = formData.get("profilePic") as File | null;

    if (!email || !password || !firstName || !lastName) {
      return { error: "Missing required fields" };
    }

    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: "Email already in use" };
    }

    let profilePicPath: string | null = null;

    if (profilePicFile && profilePicFile.size > 0) {
      const arrayBuffer = await profilePicFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), "public", "uploads", "profile_pics");
      await fs.mkdir(uploadDir, { recursive: true });

      // Generate unique filename preserving extension
      const extension = profilePicFile.name.split('.').pop() || "png";
      const filename = `${uuidv4()}.${extension}`;
      const filePath = path.join(uploadDir, filename);

      await fs.writeFile(filePath, buffer);
      
      // Store relative path for URL access
      profilePicPath = `/uploads/profile_pics/${filename}`;
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
        profilePic: profilePicPath
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
