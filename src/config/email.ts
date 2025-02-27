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
