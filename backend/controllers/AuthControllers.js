const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const JwtHelper = require("../helpers/jwt");
const EmailHelper = require("../helpers/email");
const OTPHelper = require("../helpers/otp");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/google/callback"
);

const prisma = new PrismaClient();

class AuthController {
  static async register(req, res) {
    try {
      const {
        email,
        password,
        name,
        phone = null,
        dateOfBirth = null,
        placeOfBirth = null,
        address = null,
      } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: "Email, password, dan nama wajib diisi",
        });
      }

      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        if (user.isVerified) {
          return res.status(400).json({
            success: false,
            message: "Email sudah terdaftar",
          });
        }
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            phone,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            placeOfBirth,
            address,
            isVerified: false,
          },
        });
      }

      const otp = OTPHelper.generateOTP();

      await prisma.user.update({
        where: { id: user.id },
        data: {
          otp,
          otpExpiresAt: OTPHelper.getExpirationTime(),
        },
      });

      await EmailHelper.sendOTPEmail(email, otp);

      const verifyToken = JwtHelper.generateVerifyEmailToken({
        id: user.id,
        email,
        purpose: "verify_email",
      });

      res.cookie("verify_email_token", verifyToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 10 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "OTP verifikasi telah dikirim ke email Anda",
      });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Email atau password salah",
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Email atau password salah",
        });
      }

      // Check if user is verified
      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          message: "Akun belum diverifikasi. Silakan verifikasi email Anda.",
        });
      }

      // Generate tokens
      const tokens = JwtHelper.generateTokens(user);

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() },
      });

      return res.status(200).json({
        success: true,
        message: "Login berhasil",
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
          },
          tokens,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // Verify OTP
  static async verifyOTP(req, res) {
    try {
      const verifyToken = req.cookies.verify_email_token;
      if (!verifyToken) {
        return res.status(401).json({
          success: false,
          message: "Token verifikasi tidak ditemukan",
        });
      }
      const { email, otp } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          message: "Akun sudah terverifikasi",
        });
      }

      if (user.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Kode OTP salah",
        });
      }

      if (OTPHelper.isExpired(user.otpExpiresAt)) {
        return res.status(400).json({
          success: false,
          message: "Kode OTP sudah kadaluarsa",
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          otp: null,
          otpExpiresAt: null,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isVerified: true,
        },
      });

      // Send welcome email
      await EmailHelper.sendWelcomeEmail(email, user.name);

      // Generate new tokens
      const tokens = JwtHelper.generateTokens(updatedUser);

      return res.status(200).json({
        success: true,
        message: "Verifikasi berhasil",
        data: {
          user: updatedUser,
          tokens,
        },
      });
    } catch (error) {
      console.error("Verify OTP error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  static async resendOTP(req, res) {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          message: "Akun sudah terverifikasi",
        });
      }

      const otp = OTPHelper.generateOTP();

      await prisma.user.update({
        where: { id: user.id },
        data: {
          otp,
          otpExpiresAt: OTPHelper.getExpirationTime(),
        },
      });

      const verifyToken = JwtHelper.generateVerifyEmailToken({
        id: user.id,
        email,
        purpose: "verify_email",
      });

      res.cookie("verify_email_token", verifyToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 10 * 60 * 1000,
      });

      await EmailHelper.sendOTPEmail(email, otp);

      return res.status(200).json({
        success: true,
        message: "Kode OTP baru telah dikirim ke email Anda",
      });
    } catch (error) {
      console.error("Resend OTP error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  static async googleCallback(req, res) {
    try {
      const { code } = req.query;
      if (!code) {
        return res.status(400).json({
          success: false,
          message: "Authorization code tidak ditemukan",
        });
      }

      const { tokens } = await client.getToken(code);
      client.setCredentials(tokens);

      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const googleUser = ticket.getPayload();

      let user = await prisma.user.findUnique({
        where: { googleId: googleUser.sub },
      });
      if (!user) {
        const existingEmail = await prisma.user.findUnique({
          where: { email: googleUser.email },
        });
        if (existingEmail) {
          user = await prisma.user.update({
            where: { email: googleUser.email },
            data: { googleId: googleUser.sub, isVerified: true },
          });
        } else {
          user = await prisma.user.create({
            data: {
              googleId: googleUser.sub,
              email: googleUser.email,
              name: googleUser.name,
              photo: googleUser.picture,
              isVerified: true,
            },
          });
        }
      }

      const tokensInternal = JwtHelper.generateTokens(user);

      res.cookie("accessToken", tokensInternal.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.cookie("refreshToken", tokensInternal.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${process.env.FRONTEND_URL}`);
    } catch (error) {
      console.error("Google OAuth error:", error);
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=google_oauth_failed`
      );
    }
  }

  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Refresh token diperlukan",
        });
      }

      const decoded = JwtHelper.verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: "Refresh token tidak valid atau sudah kadaluarsa",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isVerified: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      const tokens = JwtHelper.generateTokens(user);

      return res.status(200).json({
        success: true,
        message: "Token berhasil diperbarui",
        data: {
          tokens,
        },
      });
    } catch (error) {
      console.error("Refresh token error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  static async logout(req, res) {
    try {
      // Hapus cookie accessToken & refreshToken
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      // Optional: lakukan clean up lain di backend, misal invalidate refresh token di DB

      return res.status(200).json({
        success: true,
        message: "Logout berhasil",
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({
        success: false,
        message: "Logout gagal",
      });
    }
  }

  static async me(req, res) {
    try {
      // req.user sudah di-set oleh middleware authenticate
      return res.status(200).json({
        success: true,
        user: {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
          role: req.user.role,
          photo: req.user.photo,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data user",
      });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(200).json({
          success: true,
          message:
            "Jika email terdaftar, instruksi reset password akan dikirim",
        });
      }

      const resetToken = JwtHelper.generateAccessToken({
        id: user.id,
        email: user.email,
        purpose: "reset_password",
      });

      await EmailHelper.sendResetPasswordEmail(email, resetToken);

      return res.status(200).json({
        success: true,
        message: "Instruksi reset password telah dikirim ke email Anda",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }
}

module.exports = AuthController;
