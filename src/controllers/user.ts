import validator from "validator";
import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import {
  comparePasswords,
  generateToken,
  hashPassword
} from "../services/auth.js";

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
    const newUser = new User({ email, name, password: hashedPassword });
    await newUser.save();
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
    console.log(err,"Failed to Sign Up");
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
    console.log(err,"Failed to log in");
    res.status(500).json({ message: "Failed to log in" });
  }
};
