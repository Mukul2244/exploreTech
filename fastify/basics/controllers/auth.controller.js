import User from "../models/user.model";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Content can not be empty" });
    }
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Content can not be empty" });
    }
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = req.server.jwt.sign({ id: user._id });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Content can not be empty" });
    }
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.notFound({ message: "User not found" });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpiry = Date.now() + 10 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetPasswordExpiry;
    await user.save({ validateBeforeSave: false });
    const resetUrl = `http://localhost:${process.env.PORT}/app/auth/reset-password/${resetToken}`;
    // Send email with resetUrl
    res.send({ resetUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Content can not be empty" });
    }
    const resetToken = req.params.token;
    const { newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.badRequest({
        message: "Invalid or expired password reset token",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req,res) => {
  // JWT are stateless,use strategies like refresh token and blacklist token for more.
  reply.send({ message: "Logged out successfully" });
}