
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import transporter from '../config/config.js';
import {sendResponse} from '../utils/Helper.js';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '5y',
  });

const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

export const signUp = async (req, res) => {
  const { firstName, lastName, email, phone, password, address } = req.body;

  try {
    const normalizedEmail = normalizeEmail(email);
    let user = await User.findOne({ email: normalizedEmail });
    if (user) return sendResponse(res, false, 'User already exists with this email');

    const otp = generateOTP();
    user = new User({ firstName, lastName, email: normalizedEmail, phone, password, address, otp, otpExpires: Date.now() + 3600000 });

    await user.save();

    await transporter.sendMail({ to: email, subject: 'Account Verification', text: `Your OTP is ${otp}` });

    sendResponse(res, true, 'OTP sent to email');
  } catch (err) {
    sendResponse(res, false, 'Server error', null, err.message);
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail, otp, otpExpires: { $gt: Date.now() } });

    if (!user) return sendResponse(res, false, 'Invalid or expired OTP');

    user.otp = null;
    user.otpExpires = null;
    user.emailVerified = true;

    const token = createToken(user._id);
    user.sessions.push({ token });
    await user.save();

    sendResponse(res, true, 'OTP verified successfully', { token, user });
  } catch (err) {
    sendResponse(res, false, 'Server error', null, err.message);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.comparePassword(password))) {
      return sendResponse(res, false, 'Invalid credentials');
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 3600000;
    await user.save();

    await transporter.sendMail({ to: email, subject: 'Login OTP', text: `Your OTP is ${otp}` });

    sendResponse(res, true, 'OTP sent to email');
  } catch (err) {
    sendResponse(res, false, 'Server error', null, err.message);
  }
};

export const loginEmPwd = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.comparePassword(password))) {
      return sendResponse(res, false, 'Invalid credentials');
    }


    const token = createToken(user._id);
    user.sessions.push({ token });
    await user.save();

    sendResponse(res, true, 'Login successful', { token, user });
  } catch (err) {
    sendResponse(res, false, 'Server error', null, err.message);
  }
};

export const logout = async (req, res) => {
  const token = req.token;
  try {
    await User.findOneAndUpdate({ _id: req.userId }, { $pull: { sessions: { token } } });
    sendResponse(res, true, 'Logged out successfully');
  } catch (err) {
    sendResponse(res, false, 'Logout failed', null, err.message);
  }
};

export const adminCreateUser = async (req, res) => {
  const { firstName, lastName, email, phone, password, address, role = 'user' } = req.body;

  try {
    const normalizedEmail = normalizeEmail(email);
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return sendResponse(res, false, 'Email already exists');

    const newUser = new User({ firstName, lastName, email: normalizedEmail, phone, password, address, role, status: 'active' });
    await newUser.save();

    sendResponse(res, true, 'User created by admin', { user: newUser });
  } catch (err) {
    sendResponse(res, false, 'Failed to create user', null, err.message);
  }
};

export const deleteMyAccount = async (req, res) => {
  const userIdFromParam = req.params.id;
  const userIdFromToken = req.user._id.toString();

  if (userIdFromParam !== userIdFromToken) {
    return sendResponse(res, false, 'Unauthorized to delete this account');
  }

  try {
    await User.findByIdAndDelete(userIdFromParam);
    sendResponse(res, true, 'Your account has been deleted');
  } catch (err) {
    sendResponse(res, false, 'Failed to delete account', null, err.message);
  }
};

export const deleteUserByAdmin = async (req, res) => {
  const userId = req.params.id;

  try {
    if (req.user.role !== 'admin') {
      return sendResponse(res, false, 'Only admins can perform this action');
    }

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) return sendResponse(res, false, 'User not found');

    sendResponse(res, true, 'User deleted by admin successfully');
  } catch (err) {
    sendResponse(res, false, 'Failed to delete user', null, err.message);
  }
};

export const toggleUserStatusByAdmin = async (req, res) => {
  const userId = req.params.id;

  try {
    if (req.user.role !== 'admin') {
      return sendResponse(res, false, 'Only admins can perform this action');
    }

    const user = await User.findById(userId);
    if (!user) return sendResponse(res, false, 'User not found');

    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();

    sendResponse(res, true, `User status changed to ${user.status}`, { status: user.status });
  } catch (err) {
    sendResponse(res, false, 'Failed to change user status', null, err.message);
  }
};

export const updateProfile = async (req, res) => {
  const userIdFromToken = req.user._id;
  const { firstName, lastName, phone, address, profileImage } = req.body;

  try {
    const user = await User.findById(userIdFromToken);
    if (!user) return sendResponse(res, false, 'User not found');

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    sendResponse(res, true, 'Profile updated successfully', { user });
  } catch (err) {
    sendResponse(res, false, 'Failed to update profile', null, err.message);
  }
};
