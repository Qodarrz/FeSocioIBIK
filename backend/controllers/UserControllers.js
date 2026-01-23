const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const prisma = new PrismaClient();

class UserController {
  static async createUser(req, res) {
    try {
      const {
        email,
        password,
        name,
        photo,
        dateOfBirth,
        placeOfBirth,
        phone,
        address,
        googleId,
      } = req.body;

      // Validation
      if (!email || !name) {
        return res.status(400).json({
          success: false,
          message: "Email dan nama wajib diisi",
        });
      }

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email sudah terdaftar",
        });
      }

      // Generate OTP for email verification
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 jam

      // Hash password if provided
      let hashedPassword = null;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
      }

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          photo,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          placeOfBirth,
          phone,
          address,
          googleId,
          otp,
          otpExpiresAt,
        },
      });

      // Remove sensitive data from response
      const { password: _, otp: __, otpExpiresAt: ___, ...userResponse } = user;

      // Send verification email (in real app)
      console.log(`OTP for ${email}: ${otp}`); // Remove this in production

      return res.status(201).json({
        success: true,
        message: "Registrasi berhasil. Silakan verifikasi email Anda.",
        data: userResponse,
      });
    } catch (error) {
      console.error("Create user error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          photo: true,
          dateOfBirth: true,
          placeOfBirth: true,
          phone: true,
          address: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              donations: {
                where: {
                  paymentStatus: "SUCCESS",
                },
              },
              donateLogs: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      // Get donation statistics
      const donationStats = await prisma.donate.aggregate({
        where: {
          userId,
          paymentStatus: "SUCCESS",
        },
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
        _avg: {
          amount: true,
        },
      });

      // Get recent donations
      const recentDonations = await prisma.donate.findMany({
        where: {
          userId,
          paymentStatus: "SUCCESS",
        },
        include: {
          campaign: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });

      return res.status(200).json({
        success: true,
        data: {
          profile: user,
          statistics: {
            totalDonated: donationStats._sum.amount || 0,
            totalDonations: donationStats._count.id || 0,
            averageDonation: donationStats._avg.amount || 0,
            totalCampaigns: user._count.donations,
          },
          recentDonations,
        },
      });
    } catch (error) {
      console.error("Get profile error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      // Fields that cannot be updated
      const restrictedFields = ["id", "email", "role", "isVerified", "createdAt", "updatedAt"];
      restrictedFields.forEach((field) => delete updateData[field]);

      // Convert date if provided
      if (updateData.dateOfBirth) {
        updateData.dateOfBirth = new Date(updateData.dateOfBirth);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          photo: true,
          dateOfBirth: true,
          placeOfBirth: true,
          phone: true,
          address: true,
          role: true,
          isVerified: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Profile berhasil diupdate",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      // Validation
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Password lama dan baru wajib diisi",
        });
      }

      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          password: true,
        },
      });

      if (!user || !user.password) {
        return res.status(401).json({
          success: false,
          message: "Akun menggunakan login Google atau tidak ditemukan",
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Password saat ini salah",
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return res.status(200).json({
        success: true,
        message: "Password berhasil diubah",
      });
    } catch (error) {
      console.error("Change password error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // ADMIN: Get all users
  static async getAllUsers(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        role,
        isVerified,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Build filter
      const where = {};
      
      if (role) where.role = role.toUpperCase();
      if (isVerified !== undefined) where.isVerified = isVerified === "true";
      
      // Search functionality
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ];
      }

      // Get users with pagination
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            name: true,
            photo: true,
            role: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                donations: {
                  where: {
                    paymentStatus: "SUCCESS",
                  },
                },
              },
            },
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip,
          take: parseInt(limit),
        }),
        prisma.user.count({ where }),
      ]);

      // Get donation stats for each user
      const userIds = users.map((u) => u.id);
      const donationStats = await prisma.donate.groupBy({
        by: ["userId"],
        where: {
          userId: { in: userIds },
          paymentStatus: "SUCCESS",
        },
        _sum: {
          amount: true,
        },
      });

      // Map donation stats to users
      const usersWithStats = users.map((user) => {
        const stats = donationStats.find((s) => s.userId === user.id);
        return {
          ...user,
          totalDonated: stats?._sum.amount || 0,
          donationCount: user._count.donations,
        };
      });

      return res.status(200).json({
        success: true,
        data: {
          users: usersWithStats,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
          },
          filters: {
            role,
            isVerified,
            search,
          },
        },
      });
    } catch (error) {
      console.error("Get all users error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // ADMIN: Get user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          photo: true,
          dateOfBirth: true,
          placeOfBirth: true,
          phone: true,
          address: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              donations: {
                where: {
                  paymentStatus: "SUCCESS",
                },
              },
              donateLogs: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      // Get detailed donation stats
      const donationStats = await prisma.donate.aggregate({
        where: {
          userId: id,
          paymentStatus: "SUCCESS",
        },
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
        _avg: {
          amount: true,
        },
        _max: {
          amount: true,
        },
      });

      // Get recent donations
      const recentDonations = await prisma.donate.findMany({
        where: {
          userId: id,
          paymentStatus: "SUCCESS",
        },
        include: {
          campaign: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              category: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      });

      // Get donation activity by month
      const monthlyDonations = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*) as donation_count,
          SUM(amount) as total_amount
        FROM "Donate"
        WHERE "userId" = ${id} AND "paymentStatus" = 'SUCCESS'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
        LIMIT 6
      `;

      return res.status(200).json({
        success: true,
        data: {
          user,
          statistics: {
            totalDonated: donationStats._sum.amount || 0,
            totalDonations: donationStats._count.id || 0,
            averageDonation: donationStats._avg.amount || 0,
            largestDonation: donationStats._max.amount || 0,
            monthlyDonations,
          },
          recentDonations,
        },
      });
    } catch (error) {
      console.error("Get user by ID error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // ADMIN: Update user
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Remove restricted fields
      const restrictedFields = ["id", "createdAt", "updatedAt"];
      restrictedFields.forEach((field) => delete updateData[field]);

      // Convert date if provided
      if (updateData.dateOfBirth) {
        updateData.dateOfBirth = new Date(updateData.dateOfBirth);
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          photo: true,
          dateOfBirth: true,
          placeOfBirth: true,
          phone: true,
          address: true,
          role: true,
          isVerified: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "User berhasil diupdate",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Update user error:", error);
      
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // SUPER ADMIN: Delete user
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      // Check if user has donations
      const donationCount = await prisma.donate.count({
        where: {
          userId: id,
          paymentStatus: "SUCCESS",
        },
      });

      if (donationCount > 0) {
        // Soft delete by anonymizing data
        await prisma.user.update({
          where: { id },
          data: {
            email: `deleted_${Date.now()}@deleted.com`,
            name: "Deleted User",
            photo: null,
            dateOfBirth: null,
            placeOfBirth: null,
            phone: null,
            address: null,
            password: null,
            googleId: null,
            isVerified: false,
            otp: null,
            otpExpiresAt: null,
          },
        });

        return res.status(200).json({
          success: true,
          message: "User telah dianonimkan karena memiliki riwayat donasi",
        });
      }

      // Hard delete if no donations
      await prisma.user.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: "User berhasil dihapus",
      });
    } catch (error) {
      console.error("Delete user error:", error);
      
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // SUPER ADMIN: Update user role
  static async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role || !["USER", "ADMIN", "SUPER_ADMIN"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Role tidak valid",
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { role: role.toUpperCase() },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: `Role user berhasil diubah menjadi ${role}`,
        data: updatedUser,
      });
    } catch (error) {
      console.error("Update user role error:", error);
      
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // ADMIN: Verify user
  static async verifyUser(req, res) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
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
          message: "User sudah terverifikasi",
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          isVerified: true,
          otp: null,
          otpExpiresAt: null,
        },
      });

      return res.status(200).json({
        success: true,
        message: "User berhasil diverifikasi",
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          isVerified: updatedUser.isVerified,
        },
      });
    } catch (error) {
      console.error("Verify user error:", error);
      
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // Forgot password
  static async getUserDonations(req, res) {
    try {
      const { id } = req.params;
      const {
        page = 1,
        limit = 10,
        status,
        startDate,
        endDate,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Build filter
      const where = { userId: id };
      
      if (status) where.paymentStatus = status.toUpperCase();
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const [donations, total] = await Promise.all([
        prisma.donate.findMany({
          where,
          include: {
            campaign: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                category: true,
              },
            },
            logs: {
              orderBy: { createdAt: "desc" },
              take: 5,
            },
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip,
          take: parseInt(limit),
        }),
        prisma.donate.count({ where }),
      ]);

      return res.status(200).json({
        success: true,
        data: {
          donations,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Get user donations error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // ADMIN: Get user statistics
  static async getUserStats(req, res) {
    try {
      const { id } = req.params;

      const [
        user,
        donationStats,
        monthlyStats,
        campaignStats,
        recentActivity
      ] = await Promise.all([
        // User info
        prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          },
        }),

        // Overall donation stats
        prisma.donate.aggregate({
          where: {
            userId: id,
            paymentStatus: "SUCCESS",
          },
          _sum: { amount: true },
          _count: { id: true },
          _avg: { amount: true },
          _max: { amount: true },
          _min: { amount: true },
        }),

        // Monthly statistics
        prisma.$queryRaw`
          SELECT 
            DATE_TRUNC('month', "createdAt") as month,
            COUNT(*) as donation_count,
            SUM(amount) as total_amount,
            AVG(amount) as avg_amount
          FROM "Donate"
          WHERE "userId" = ${id} AND "paymentStatus" = 'SUCCESS'
          GROUP BY DATE_TRUNC('month', "createdAt")
          ORDER BY month DESC
          LIMIT 12
        `,

        // Campaign statistics
        prisma.donate.groupBy({
          by: ["campaignId"],
          where: {
            userId: id,
            paymentStatus: "SUCCESS",
          },
          _sum: { amount: true },
          _count: { id: true },
          orderBy: {
            _sum: { amount: "desc" },
          },
          take: 5,
        }),

        // Recent activity
        prisma.donateLog.findMany({
          where: {
            donate: { userId: id },
          },
          include: {
            donate: {
              select: {
                amount: true,
                campaign: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            changedBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        }),
      ]);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      // Get campaign names for campaign stats
      const campaignIds = campaignStats.map((stat) => stat.campaignId);
      const campaigns = await prisma.campaign.findMany({
        where: { id: { in: campaignIds } },
        select: { id: true, name: true },
      });

      const campaignStatsWithNames = campaignStats.map((stat) => {
        const campaign = campaigns.find((c) => c.id === stat.campaignId);
        return {
          ...stat,
          campaignName: campaign?.name || "Unknown Campaign",
        };
      });

      return res.status(200).json({
        success: true,
        data: {
          user,
          statistics: {
            overall: {
              totalDonated: donationStats._sum.amount || 0,
              totalDonations: donationStats._count.id || 0,
              averageDonation: donationStats._avg.amount || 0,
              largestDonation: donationStats._max.amount || 0,
              smallestDonation: donationStats._min.amount || 0,
            },
            monthly: monthlyStats,
            topCampaigns: campaignStatsWithNames,
          },
          recentActivity,
        },
      });
    } catch (error) {
      console.error("Get user stats error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }
}

module.exports = UserController;