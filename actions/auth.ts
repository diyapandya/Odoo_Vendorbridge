/* "use server";

import { AuthService } from "@/lib/services/auth.service";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const registerUser = async (formData: FormData) => {
  try {
    const profilePicFile = formData.get("profilePic") as File | null;
    let profilePicPath: string | null = null;

    if (profilePicFile && profilePicFile.size > 0) {
      const arrayBuffer = await profilePicFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadDir = path.join(process.cwd(), "public", "uploads", "profile_pics");
      await fs.mkdir(uploadDir, { recursive: true });

      const extension = profilePicFile.name.split('.').pop() || "png";
      const filename = `${uuidv4()}.${extension}`;
      const filePath = path.join(uploadDir, filename);

      await fs.writeFile(filePath, buffer);
      profilePicPath = `/uploads/profile_pics/${filename}`;
    }

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phone: formData.get("phone") as string,
      role: formData.get("role") as string,
      country: formData.get("country") as string,
      profilePicPath,
    };

    return await AuthService.register(data);
  } catch (error) {
    console.error("Registration Error", error);
    return { error: "Something went wrong!" };
  }
};

export const verifyEmail = async (token: string) => {
  return await AuthService.verifyEmail(token);
};

export const resetPasswordRequest = async (email: string) => {
  return await AuthService.requestPasswordReset(email);
};

export const resetPassword = async (token: string, password: string) => {
  return await AuthService.resetPassword(token, password);
};
*/