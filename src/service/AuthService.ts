import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUserService = async (
  password: string,
  username: string,
  email: string,
  role: string
): Promise<void> => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists with this email address");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  await user.save();
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    }
  );

  return token;
};
