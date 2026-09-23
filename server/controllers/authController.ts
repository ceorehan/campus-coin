import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import { Category } from '../models/Category.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/generateToken.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// @desc    Register a new student
// @route   POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, academicYear, monthlyAllowanceBaseline, savingsGoal } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      academicYear: academicYear || 'Freshman',
      monthlyAllowanceBaseline: monthlyAllowanceBaseline ? Number(monthlyAllowanceBaseline) : 40000,
      savingsGoal: savingsGoal ? Number(savingsGoal) : 10000,
      role: 'student',
      isActive: true,
    });

    const token = generateToken(user._id.toString(), user.role);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          academicYear: user.academicYear,
          monthlyAllowanceBaseline: user.monthlyAllowanceBaseline,
          savingsGoal: user.savingsGoal,
          currency: user.currency,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    const isMatch = await comparePassword(password, user.password || '');
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id.toString(), user.role);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          academicYear: user.academicYear,
          monthlyAllowanceBaseline: user.monthlyAllowanceBaseline,
          savingsGoal: user.savingsGoal,
          currency: user.currency,
          themePreference: user.themePreference,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't leak user existence
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, a reset token has been generated.',
      });
    }

    // Generate 6-digit reset code
    const resetToken = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordResetToken.deleteMany({ userId: user._id });
    await PasswordResetToken.create({
      userId: user._id,
      token: resetToken,
      expiresAt,
    });

    return res.status(200).json({
      success: true,
      message: 'Password reset code generated.',
      data: {
        demoResetCode: resetToken, // Provided for easy testing in demo environment
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, token, and new password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid request' });
    }

    const validToken = await PasswordResetToken.findOne({
      userId: user._id,
      token,
      expiresAt: { $gt: new Date() },
    });

    if (!validToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    user.password = await hashPassword(newPassword);
    await user.save();
    await PasswordResetToken.deleteMany({ userId: user._id });

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now login.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        academicYear: req.user.academicYear,
        monthlyAllowanceBaseline: req.user.monthlyAllowanceBaseline,
        savingsGoal: req.user.savingsGoal,
        currency: req.user.currency,
        themePreference: req.user.themePreference,
        fontSize: req.user.fontSize,
        notificationsEnabled: req.user.notificationsEnabled,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
