/**
 * Token Service
 * Handles JWT token generation and validation
 */

const jwt = require('jsonwebtoken');
const { getEnvConfig } = require('../config/env');

const envConfig = getEnvConfig();

/**
 * Generate access token
 * @param {Object} payload - Token payload (id, email, role)
 * @returns {string} JWT access token
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, envConfig.jwtSecret, {
    expiresIn: envConfig.jwtExpire,
  });
}

/**
 * Generate refresh token
 * @param {Object} payload - Token payload (id, email, role)
 * @returns {string} JWT refresh token
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, envConfig.jwtRefreshSecret, {
    expiresIn: envConfig.jwtRefreshExpire,
  });
}

/**
 * Verify access token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid
 */
function verifyAccessToken(token) {
  return jwt.verify(token, envConfig.jwtSecret);
}

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, envConfig.jwtRefreshSecret);
}

/**
 * Generate token pair (access + refresh)
 * @param {Object} payload - Token payload
 * @returns {Object} Object with accessToken and refreshToken
 */
function generateTokenPair(payload) {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
};
