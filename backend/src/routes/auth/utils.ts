import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const saltRounds = Number(process.env.SALT_ROUNDS);

const generateHash = async (data: string) => {
  const hashed = await bcrypt.hash(data, saltRounds);
  return hashed;
};

export const userHashedSignupDetails = async (
  name: string,
  email: string,
  password: string
) => {
  const [hashedName, hashedEmail, hashedPassword] = await Promise.all([
    generateHash(name),
    generateHash(email),
    generateHash(password),
  ]);

  return { hashedName, hashedEmail, hashedPassword };
};
const JWT_SECRET = process.env.JWT_SECRET || "default-wont-work";
const JWT_EXPIRY = "1d";
export const generateAuthToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

export const validatePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};
