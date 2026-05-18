import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

const createToken = (user: { id: string; email: string; role: string }) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured.");
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, {
    expiresIn: "1d"
  });
};

const validateRegisterPayload = (body: any) => {
  if (!body?.name || !body?.email || !body?.password) {
    return "Name, email, and password are required.";
  }
  if (typeof body.name !== "string" || body.name.trim().length < 2) {
    return "Name must be at least 2 characters.";
  }
  if (typeof body.email !== "string" || !body.email.includes("@")) {
    return "Please provide a valid email address.";
  }
  if (typeof body.password !== "string" || body.password.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  return null;
};

export const register = async (req: Request, res: Response) => {
  try {
    const validationError = validateRegisterPayload(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to register user." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = createToken({ id: user._id.toString(), email: user.email, role: user.role });

    res.json({
      success: true,
      token,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
};