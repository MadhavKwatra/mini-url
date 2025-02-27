import { Resend } from "resend";
import { APP_NAME } from "./constants.js";
let resend: Resend | null;

export const sendVerificationEmail = async (email: string, token: string) => {
  if (!resend) {
    console.log("Resend initialized");
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  const verificationUrl = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `${APP_NAME} | Verification Email`,
      html: `<h2>Welcome to Mini URL!</h2>
      <p>Hi there, ${email}</p>
      <p>You're almost there! Please confirm your email address to start using Mini URL.</p>
      <a href="${verificationUrl}">Verify here</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>© 2025 Mini URL. All rights reserved.</p>`
    });
    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Error sending verification email" };
  }
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  if (!resend) {
    console.log("Resend initialized");
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  const passwordResetUrl = `${process.env.BASE_URL}/auth/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `${APP_NAME} | Password Reset Request`,
      html: `<h2>Welcome to Mini URL!</h2>
      <p>Hi there, ${email}</p>
      <p>You're almost there! Please click below to reset your password and get started again with using Mini URL.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${passwordResetUrl}">Reset Password</a><br><br>
      <a href="${passwordResetUrl}">${passwordResetUrl}</a>
      <p>If the above link doesn't work, please copy and paste the URL into your browser.</p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>© 2025 Mini URL. All rights reserved.</p>`
    });
    console.log("Password reset email sent to:", email);

    return { success: true, message: "Password reset email sent successfully" };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, message: "Error sending password reset email" };
  }
};
