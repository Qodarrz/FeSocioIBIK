const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  "your-refresh-secret-key-change-in-production";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

class JwtHelper {
  static generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  static generateRefreshToken(payload) {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (error) {
      return null;
    }
  }

  static generateTokens(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  static generateOTPToken(email, otp) {
    return jwt.sign({ email, otp }, JWT_SECRET, {
      expiresIn: "10m", // OTP valid for 10 minutes
    });
  }

  static verifyOTPToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  static decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }

  static generateVerifyEmailToken(payload) {
    return jwt.sign(payload, process.env.JWT_VERIFY_EMAIL_SECRET, {
      expiresIn: "10m",
    });
  }

  static verifyVerifyEmailToken(token) {
    return jwt.verify(token, process.env.JWT_VERIFY_EMAIL_SECRET);
  }
}

module.exports = JwtHelper;
