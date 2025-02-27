import validator from "validator";
import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import {
  comparePasswords,
  generatePasswordResetToken,
  generateToken,
  generateVerificationToken,
  hashPassword,
  verifyPasswordResetToken,
  verifyVerificationToken
} from "../services/auth.js";
import {
  sendResetPasswordEmail,
  sendVerificationEmail
} from "../config/email.js";

export const handleUserSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, name, password } = req.body;

  if (
    // TODO: add some validation
    !email ||
    !name ||
    !password ||
    !validator.isEmail(email)
  ) {
    res.status(400).json({ message: "Invalid data provided for sign up" });
    return;
  }
  try {
    const userFound = await User.findOne({ email });
    if (userFound) {
      res.status(400).json({
        message: "This email already have a account",
        description: "You can log in with the email or try with another email"
      });
      return;
    }
    const hashedPassword = await hashPassword(password);
    const token = generateVerificationToken(email);
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      verificationToken: token
    });
    await newUser.save();

    const verificationEmailResponse = await sendVerificationEmail(email, token);
    if (!verificationEmailResponse?.success) {
      res.status(500).json({
        success: false,
        message: verificationEmailResponse.message
      });
      return;
    }
    const totalUsers = await User.countDocuments();
    res.status(201).json({
      data: {
        name: newUser.name,
        email: newUser.email,
        id: newUser._id.toString(),
        totalUsers: totalUsers
      },
      message: "User Created Successfully"
    });
  } catch (err) {
    console.log(err, "Failed to Sign Up");
    res.status(500).json({ message: "Failed to Sign Up" });
  }
};
export const handleUserLogIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (
    // TODO: add more validation
    !email ||
    !password
  ) {
    res
      .status(400)
      .json({ message: "Email and password are required for login" });
    return;
  }
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      res.status(400).json({ message: "This email does not have a account" });
      return;
    }
    if (!userFound.isVerified) {
      res.status(400).json({
        message: "This email is not verified. Please verify your email."
      });
      return;
    }

    const isPasswordValid = await comparePasswords(
      password,
      userFound.password
    );
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid Credentials" });
      return;
    }

    const token = generateToken({
      id: userFound._id.toString(),
      email: userFound.email,
      name: userFound.name
    });
    res.status(200).json({
      data: { token, name: userFound.name, email: userFound.email },
      message: "Logged In Successfully"
    });
  } catch (err) {
    console.log(err, "Failed to log in");
    res.status(500).json({ message: "Failed to log in" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      res.status(400).json({ message: "Verification token is required" });
      return;
    }

    let decoded;
    try {
      decoded = verifyVerificationToken(token as string);
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
      return;
    }

    // Find user by email
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: "User already verified" });
      return;
    }
    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error, "Error verifying email");
    res.status(500).json({ message: "Error verifying email" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = generatePasswordResetToken({
      email: user.email,
      id: user._id.toString(),
      name: user.name
    });

    // Save token in user record (optional)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send reset email
    const resetPasswordEmailResponse = await sendResetPasswordEmail(
      user.email,
      resetToken
    );

    if (!resetPasswordEmailResponse?.success) {
      res.status(500).json({
        success: false,
        message: resetPasswordEmailResponse.message
      });
      return;
    }
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Error processing request" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = verifyPasswordResetToken(token as string) as { userId: string };
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
      return;
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if token is expired
    if (
      user.resetPasswordExpires &&
      new Date(user.resetPasswordExpires) < new Date()
    ) {
      res.status(400).json({ message: "Reset token expired" });
      return;
    }
    // If already reset
    if (!user.resetPasswordExpires && !user.resetPasswordToken) {
      res
        .status(400)
        .json({ message: "You have already resetted the Password" });
      return;
    }

    // Hash new password and save
    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ message: "Error processing password reset request" });
  }
};
