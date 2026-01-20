const crypto = require('crypto');
const User = require('../models/User');
const { generateTokenPair, verifyRefreshToken } = require('../utils/tokenService');
const { isValidEmail, validatePassword, validateName, sanitizeString, isValidRole } = require('../utils/validators');
const { createErrorResponse, createSuccessResponse, asyncHandler } = require('../utils/errors');

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate input
  const errors = [];

  // Validate name
  const nameValidation = validateName(name);
  if (!nameValidation.isValid) {
    errors.push({ field: 'name', message: nameValidation.message });
  }

  // Validate email
  if (!email || !isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push({ field: 'password', message: passwordValidation.message });
  }

  // Validate role (if provided)
  let userRole = 'student'; // Default role
  if (role) {
    if (!isValidRole(role)) {
      errors.push({ field: 'role', message: 'Invalid role. Must be student, instructor, or admin' });
    } else {
      // Only allow setting instructor/admin roles if explicitly allowed (in production, this should be admin-only)
      // For now, we'll allow it but you may want to restrict this
      userRole = role;
    }
  }

  if (errors.length > 0) {
    const errorResponse = createErrorResponse('Validation failed', 400, errors);
    return res.status(400).json(errorResponse);
  }

  // Check if user already exists
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    const errorResponse = createErrorResponse('User already exists with that email', 400);
    return res.status(400).json(errorResponse);
  }

  // Create user
  const user = await User.create({
    name: sanitizeString(name),
    email: email.toLowerCase(),
    passwordHash: password, // Will be hashed by pre-save hook
    role: userRole,
  });

  // Generate tokens
  const tokenPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const { response, statusCode } = createSuccessResponse(
    'User registered successfully',
    {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    201
  );

  res.status(statusCode).json(response);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    const errorResponse = createErrorResponse('Please provide email and password', 400);
    return res.status(400).json(errorResponse);
  }

  if (!isValidEmail(email)) {
    const errorResponse = createErrorResponse('Please provide a valid email address', 400);
    return res.status(400).json(errorResponse);
  }

  try {
    // Find user and select password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash +refreshToken');
    
    if (!user) {
      const errorResponse = createErrorResponse('Invalid email or password', 401);
      return res.status(401).json(errorResponse);
    }

    // Check if passwordHash exists
    if (!user.passwordHash) {
      console.error('User found but passwordHash is missing:', user.email);
      const errorResponse = createErrorResponse('Invalid email or password', 401);
      return res.status(401).json(errorResponse);
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      const errorResponse = createErrorResponse('Invalid email or password', 401);
      return res.status(401).json(errorResponse);
    }

    // Generate tokens
    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const { response, statusCode } = createSuccessResponse('Login successful', {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    res.status(statusCode).json(response);
  } catch (error) {
    console.error('Login error:', error);
    // Re-throw to be handled by asyncHandler
    throw error;
  }
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    const errorResponse = createErrorResponse('Refresh token is required', 400);
    return res.status(400).json(errorResponse);
  }

  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(token);

    // Find user with this refresh token
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      const errorResponse = createErrorResponse('Invalid refresh token', 401);
      return res.status(401).json(errorResponse);
    }

    // Generate new token pair
    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(tokenPayload);

    // Update refresh token
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    const { response, statusCode } = createSuccessResponse('Token refreshed successfully', {
      accessToken,
      refreshToken: newRefreshToken,
    });

    res.status(statusCode).json(response);
  } catch (error) {
    const errorResponse = createErrorResponse('Invalid or expired refresh token', 401);
    return res.status(401).json(errorResponse);
  }
});

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !isValidEmail(email)) {
    const errorResponse = createErrorResponse('Please provide a valid email address', 400);
    return res.status(400).json(errorResponse);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  
  // Don't reveal if user exists or not (security best practice)
  // Always return success message
  if (user) {
    // Generate reset token (in production, send email with this token)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // In a real implementation, you would:
    // 1. Save resetToken and resetTokenExpiry to user model
    // 2. Send email with reset link containing the token
    // For now, we'll just log it (in production, use a proper email service)
    console.log(`Password reset token for ${user.email}: ${resetToken}`);
    
    // TODO: Add resetToken and resetTokenExpiry fields to User model
    // user.resetToken = resetToken;
    // user.resetTokenExpiry = resetTokenExpiry;
    // await user.save({ validateBeforeSave: false });
  }

  // Always return success to prevent email enumeration
  const { response, statusCode } = createSuccessResponse(
    'If an account exists with that email, a password reset link has been sent'
  );
  res.status(statusCode).json(response);
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    const errorResponse = createErrorResponse('Token and password are required', 400);
    return res.status(400).json(errorResponse);
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    const errorResponse = createErrorResponse(passwordValidation.message, 400);
    return res.status(400).json(errorResponse);
  }

  // In a real implementation, you would:
  // 1. Find user by resetToken
  // 2. Check if resetTokenExpiry is still valid
  // 3. Update password and clear resetToken
  // For now, we'll return an error indicating this needs to be implemented
  const errorResponse = createErrorResponse(
    'Password reset functionality requires database schema update. Please implement resetToken and resetTokenExpiry fields in User model.',
    501
  );
  return res.status(501).json(errorResponse);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    const errorResponse = createErrorResponse('User not found', 404);
    return res.status(404).json(errorResponse);
  }

  const { response, statusCode } = createSuccessResponse('User retrieved successfully', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });

  res.status(statusCode).json(response);
});

// @desc    Logout user (invalidate refresh token)
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (user) {
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
  }

  const { response, statusCode } = createSuccessResponse('Logged out successfully');
  res.status(statusCode).json(response);
});

module.exports = {
  signup,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
  logout,
};
