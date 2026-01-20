/**
 * Environment Variable Validation
 * Validates all required environment variables on server startup
 */

const requiredEnvVars = {
  MONGO_URI: {
    description: 'MongoDB connection string',
    example: 'mongodb+srv://user:pass@cluster.mongodb.net/elearning',
  },
  JWT_SECRET: {
    description: 'Secret key for JWT token signing',
    example: 'your_super_secret_key_here',
    minLength: 32, // Require at least 32 characters for security
  },
};

const optionalEnvVars = {
  JWT_REFRESH_SECRET: {
    description: 'Secret key for refresh token signing',
    default: null,
    minLength: 32,
  },
  JWT_EXPIRE: {
    description: 'JWT token expiration time',
    default: '7d',
  },
  JWT_REFRESH_EXPIRE: {
    description: 'Refresh token expiration time',
    default: '30d',
  },
  PORT: {
    description: 'Server port',
    default: 5000,
  },
  NODE_ENV: {
    description: 'Environment mode (development/production)',
    default: 'development',
    allowedValues: ['development', 'production', 'test'],
  },
  FRONTEND_URL: {
    description: 'Frontend URL for CORS',
    default: 'http://localhost:3000',
  },
};

/**
 * Validate environment variables
 * @throws {Error} If required variables are missing or invalid
 */
function validateEnv() {
  const errors = [];
  const warnings = [];

  // Validate required variables
  for (const [varName, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[varName];

    if (!value || value.trim() === '') {
      errors.push(
        `❌ Missing required environment variable: ${varName}\n` +
        `   Description: ${config.description}\n` +
        `   Example: ${config.example}`
      );
      continue;
    }

    // Check minimum length if specified
    if (config.minLength && value.length < config.minLength) {
      errors.push(
        `❌ ${varName} must be at least ${config.minLength} characters long\n` +
        `   Current length: ${value.length}`
      );
    }
  }

  // Validate optional variables and set defaults
  for (const [varName, config] of Object.entries(optionalEnvVars)) {
    const value = process.env[varName];

    if (!value || value.trim() === '') {
      if (config.default !== null && config.default !== undefined) {
        process.env[varName] = config.default;
        warnings.push(
          `⚠️  ${varName} not set, using default: ${config.default}`
        );
      }
    } else {
      // Validate allowed values if specified
      if (config.allowedValues && !config.allowedValues.includes(value)) {
        errors.push(
          `❌ ${varName} must be one of: ${config.allowedValues.join(', ')}\n` +
          `   Current value: ${value}`
        );
      }

      // Check minimum length if specified
      if (config.minLength && value.length < config.minLength) {
        warnings.push(
          `⚠️  ${varName} should be at least ${config.minLength} characters for security`
        );
      }
    }
  }

  // Display warnings
  if (warnings.length > 0) {
    console.log('\n⚠️  Environment Variable Warnings:');
    warnings.forEach((warning) => console.log(warning));
  }

  // Display errors and exit if any
  if (errors.length > 0) {
    console.error('\n❌ Environment Variable Validation Failed:\n');
    errors.forEach((error) => console.error(error));
    console.error(
      '\n💡 Tip: Copy .env.example to .env and fill in the required values.\n'
    );
    process.exit(1);
  }

  // Success message
  if (process.env.NODE_ENV !== 'test') {
    console.log('✅ Environment variables validated successfully');
  }
}

/**
 * Get environment configuration
 * @returns {Object} Environment configuration object
 */
function getEnvConfig() {
  return {
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
    port: parseInt(process.env.PORT, 10) || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  };
}

module.exports = {
  validateEnv,
  getEnvConfig,
};
