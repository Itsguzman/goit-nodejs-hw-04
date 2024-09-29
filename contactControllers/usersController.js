import { User } from "../models/userModel.js";
import { signupValidation, subscriptionValidation } from "../validation.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const { SECRET_KEY } = process.env;

const signupUser = async (req, res) => {
  const { error } = signupValidation.validate(req.body);

  if (error) {
    res.status(400).json({ message: "Please fill all required fields" });
  }

  try {
    const { email, password } = req.body;
    const verifyUser = await User.findOne({ email });

    if (verifyUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashPass });
    res.status(201).json({
      user: {
        email: newUser.email,
        password: newUser.password,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { error } = signupValidation.validate(req.body);

  if (error) {
    res.status(400).json({ message: "Invalid input" });
  }
  try {
    const { email, password } = req.body;

    const verifyUser = await User.findOne({ email });

    if (verifyUser) {
      return res.status(401).json({ message: "Wrong email" });
    }

    const PasswordValid = await bcrypt.compare(password, verifyUser.password);

    if (!PasswordValid) {
      return res.status(401).json({ message: "Wrong Password" });
    }

    const payload = { id: verifyUser._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(verifyUser._id, { token: token });
    res.status(200).json({
      token: token,
      user: {
        email: verifyUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserSubscription = async (req, res) => {
  try {
    const { error } = subscriptionValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { _id } = req.user;
    const updateUser = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
    });

    res.json({
      email: updateUser.email,
      subscription: updateUser.subscription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const logoutUser = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).send("logout user");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const { email, subscription } = req.user;
    res.jhson({
      email,
      subscription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserSubscription,
};
