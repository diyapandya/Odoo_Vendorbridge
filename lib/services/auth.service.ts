import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { TokenService } from "./token.service";
import { MailService } from "./mail.service";
import { UserService } from "./user.service";

export class AuthService {
  static async register(data: any) {
    const { email, password, firstName, lastName, phone, role, country, profilePicPath } = data;

    if (!email || !password || !firstName || !lastName) {
      return { error: "Missing required fields" };
    }

    const existingUser = await UserService.getUserByEmail(email);

    if (existingUser) {
      return { error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserService.createUser({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      phone: phone || "",
      role: role || "Vendor",
      country: country || "Unknown",
      profilePic: profilePicPath
    });

    const verificationToken = await TokenService.generateVerificationToken(email);
    await MailService.sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Confirmation email sent!" };
  }

  static async verifyEmail(token: string) {
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

    const existingUser = await UserService.getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { error: "Email does not exist!" };
    }

    await UserService.updateUser(existingUser.id, {
      emailVerified: new Date(),
      email: existingToken.email
    });

    await db.verificationToken.delete({
      where: { id: existingToken.id }
    });

    return { success: "Email verified!" };
  }

  static async requestPasswordReset(email: string) {
    const existingUser = await UserService.getUserByEmail(email);

    if (!existingUser) {
      return { error: "Email not found!" };
    }

    const passwordResetToken = await TokenService.generatePasswordResetToken(email);
    await MailService.sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    return { success: "Reset email sent!" };
  }

  static async resetPassword(token: string, password: string) {
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

    const existingUser = await UserService.getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { error: "Email does not exist!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserService.updateUser(existingUser.id, {
      password: hashedPassword
    });

    await db.passwordResetToken.delete({
      where: { id: existingToken.id }
    });

    return { success: "Password updated!" };
  }

  static async authenticateCredentials(credentials: any) {
    if (!credentials?.email || !credentials?.password) {
      throw new Error("Invalid credentials");
    }

    const user = await UserService.getUserByEmail(credentials.email);

    if (!user || !user?.password) {
      throw new Error("Invalid credentials");
    }

    const isCorrectPassword = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isCorrectPassword) {
      throw new Error("Invalid credentials");
    }

    if (!user.emailVerified) {
      throw new Error("Email not verified! Please verify your email.");
    }

    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role
    };
  }
}
