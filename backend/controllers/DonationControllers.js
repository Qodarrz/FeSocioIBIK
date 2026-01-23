const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class DonationController {
  static async createDonation(req, res) {
    try {
      const {
        bencanaId,
        amount,
        message = "",
        isAnonymous = false,
        paymentMethod,
        donorName,
        donorEmail,
        donorPhone,
      } = req.body;

      const userId = req.user?.id;

      // Validation
      if (!bencanaId || !amount || !paymentMethod) {
        return res.status(400).json({
          success: false,
          message: "Bencana ID, amount, dan payment method wajib diisi",
        });
      }

      // Check if disaster exists and is active
      const bencana = await prisma.bencana.findUnique({
        where: { id: bencanaId },
      });

      if (!bencana) {
        return res.status(404).json({
          success: false,
          message: "Bencana tidak ditemukan",
        });
      }

      if (bencana.status !== "ACTIVE") {
        return res.status(400).json({
          success: false,
          message: "Bencana tidak aktif untuk menerima donasi",
        });
      }

      // If user is logged in, use user data
      let donationData = {
        bencanaId,
        amount: parseFloat(amount),
        message,
        isAnonymous,
        paymentMethod,
      };

      if (userId && !isAnonymous) {
        donationData.userId = userId;
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        donationData.donorName = user.name;
        donationData.donorEmail = user.email;
        donationData.donorPhone = user.phone;
      } else {
        // For anonymous or non-logged in users
        if (!donorName || !donorEmail) {
          return res.status(400).json({
            success: false,
            message: "Nama dan email donor wajib diisi untuk donasi anonim",
          });
        }
        donationData.donorName = donorName;
        donationData.donorEmail = donorEmail;
        donationData.donorPhone = donorPhone;
      }

      // Create donation
      const donation = await prisma.donate.create({
        data: donationData,
        include: {
          bencana: {
            select: {
              id: true,
              name: true,
              location: true,
              totalDonation: true,
              totalDonors: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              photo: true,
            },
          },
        },
      });

      // Create initial log
      await prisma.donateLog.create({
        data: {
          donateId: donation.id,
          oldStatus: null,
          newStatus: "PENDING",
          note: "Donasi dibuat",
          changedById: userId || null,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Donasi berhasil dibuat",
        data: donation,
      });
    } catch (error) {
      console.error("Create donation error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // Get all donations (with filtering)
  static async getAllDonations(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        bencanaId,
        userId,
        paymentStatus,
        paymentMethod,
        startDate,
        endDate,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Build filter
      const where = {};

      if (bencanaId) where.bencanaId = bencanaId;
      if (userId) where.userId = userId;
      if (paymentStatus) where.paymentStatus = paymentStatus;
      if (paymentMethod) where.paymentMethod = paymentMethod;

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      // Get donations with pagination
      const [donations, total] = await Promise.all([
        prisma.donate.findMany({
          where,
          include: {
            bencana: {
              select: {
                id: true,
                name: true,
                location: true,
                imageUrl: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                photo: true,
              },
            },
            logs: {
              orderBy: {
                createdAt: "desc",
              },
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

      const summary = await prisma.donate.aggregate({
        where,
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
      });

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
          summary: {
            totalAmount: summary._sum.amount || 0,
            totalDonations: summary._count.id || 0,
          },
        },
      });
    } catch (error) {
      console.error("Get donations error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // Get donation by ID
  static async getDonationById(req, res) {
    try {
      const { id } = req.params;

      const donation = await prisma.donate.findUnique({
        where: { id },
        include: {
          bencana: {
            select: {
              id: true,
              name: true,
              description: true,
              location: true,
              imageUrl: true,
              status: true,
              totalDonation: true,
              totalDonors: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              photo: true,
            },
          },
          logs: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              changedBy: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!donation) {
        return res.status(404).json({
          success: false,
          message: "Donasi tidak ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        data: donation,
      });
    } catch (error) {
      console.error("Get donation by ID error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  static async updateDonationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, note } = req.body;
      const userId = req.user.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status wajib diisi",
        });
      }

      // Get current donation
      const donation = await prisma.donate.findUnique({
        where: { id },
        include: {
          bencana: true,
        },
      });

      if (!donation) {
        return res.status(404).json({
          success: false,
          message: "Donasi tidak ditemukan",
        });
      }

      const oldStatus = donation.paymentStatus;
      const oldTotal = donation.bencana.totalDonation;
      const oldDonors = donation.bencana.totalDonors;

      // Update donation
      const updatedDonation = await prisma.donate.update({
        where: { id },
        data: {
          paymentStatus: status,
        },
        include: {
          bencana: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Create log
      await prisma.donateLog.create({
        data: {
          donateId: id,
          oldStatus,
          newStatus: status,
          note: note || `Status diubah dari ${oldStatus} ke ${status}`,
          changedById: userId,
        },
      });

      // Update disaster statistics if status changed to/from SUCCESS
      if (
        (oldStatus === "SUCCESS" && status !== "SUCCESS") ||
        (oldStatus !== "SUCCESS" && status === "SUCCESS")
      ) {
        const newTotal =
          status === "SUCCESS"
            ? oldTotal + donation.amount
            : oldTotal - donation.amount;

        const newDonors =
          status === "SUCCESS" ? oldDonors + 1 : oldDonors - 1;

        await prisma.bencana.update({
          where: { id: donation.bencanaId },
          data: {
            totalDonation: newTotal,
            totalDonors: newDonors,
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Status donasi berhasil diperbarui",
        data: updatedDonation,
      });
    } catch (error) {
      console.error("Update donation status error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // Upload payment proof
  static async uploadPaymentProof(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { paymentProof } = req.body;

      if (!paymentProof) {
        return res.status(400).json({
          success: false,
          message: "Bukti pembayaran wajib diisi",
        });
      }

      // Check if donation exists and belongs to user
      const donation = await prisma.donate.findUnique({
        where: { id },
      });

      if (!donation) {
        return res.status(404).json({
          success: false,
          message: "Donasi tidak ditemukan",
        });
      }

      // Check ownership (user can only upload proof for their own donations)
      if (donation.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses untuk donasi ini",
        });
      }

      // Update donation
      const updatedDonation = await prisma.donate.update({
        where: { id },
        data: {
          paymentProof,
          paymentStatus: "PROCESSING",
        },
      });

      // Create log
      await prisma.donateLog.create({
        data: {
          donateId: id,
          oldStatus: donation.paymentStatus,
          newStatus: "PROCESSING",
          note: "Bukti pembayaran diupload",
          changedById: userId,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Bukti pembayaran berhasil diupload",
        data: updatedDonation,
      });
    } catch (error) {
      console.error("Upload payment proof error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // Get user's donations
  static async getMyDonations(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [donations, total] = await Promise.all([
        prisma.donate.findMany({
          where: { userId },
          include: {
            bencana: {
              select: {
                id: true,
                name: true,
                location: true,
                imageUrl: true,
                status: true,
              },
            },
            logs: {
              orderBy: {
                createdAt: "desc",
              },
              take: 3,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: parseInt(limit),
        }),
        prisma.donate.count({ where: { userId } }),
      ]);

      // Calculate total donated
      const totalDonated = await prisma.donate.aggregate({
        where: {
          userId,
          paymentStatus: "SUCCESS",
        },
        _sum: {
          amount: true,
        },
      });

      return res.status(200).json({
        success: true,
        data: {
          donations,
          summary: {
            totalDonations: total,
            totalDonated: totalDonated._sum.amount || 0,
          },
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Get my donations error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // Get donation statistics
  static async getDonationStatistics(req, res) {
    try {
      const { startDate, endDate, bencanaId } = req.query;

      const where = {};
      if (bencanaId) where.bencanaId = bencanaId;
      where.paymentStatus = "SUCCESS";

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      // Overall statistics
      const overallStats = await prisma.donate.aggregate({
        where,
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

      // Statistics by disaster
      const byDisaster = await prisma.donate.groupBy({
        by: ["bencanaId"],
        where,
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
        orderBy: {
          _sum: {
            amount: "desc",
          },
        },
      });

      // Get disaster names
      const disasterIds = byDisaster.map((item) => item.bencanaId);
      const disasters = await prisma.bencana.findMany({
        where: {
          id: { in: disasterIds },
        },
        select: {
          id: true,
          name: true,
          location: true,
        },
      });

      // Map disaster names to stats
      const byDisasterWithNames = byDisaster.map((item) => {
        const disaster = disasters.find((d) => d.id === item.bencanaId);
        return {
          ...item,
          bencana: disaster || null,
        };
      });

      // Statistics by payment method
      const byPaymentMethod = await prisma.donate.groupBy({
        by: ["paymentMethod"],
        where,
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
      });

      // Recent donations
      const recentDonations = await prisma.donate.findMany({
        where,
        include: {
          bencana: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              photo: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      });

      return res.status(200).json({
        success: true,
        data: {
          overall: {
            totalAmount: overallStats._sum.amount || 0,
            totalDonations: overallStats._count.id || 0,
            averageAmount: overallStats._avg.amount || 0,
          },
          byDisaster: byDisasterWithNames,
          byPaymentMethod,
          recentDonations,
        },
      });
    } catch (error) {
      console.error("Get donation statistics error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // Get top donors
  static async getTopDonors(req, res) {
    try {
      const { limit = 10, period = "all" } = req.query;

      // Calculate date filter based on period
      let dateFilter = {};
      const now = new Date();
      
      if (period === "week") {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        dateFilter.gte = weekAgo;
      } else if (period === "month") {
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        dateFilter.gte = monthAgo;
      } else if (period === "year") {
        const yearAgo = new Date(now);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        dateFilter.gte = yearAgo;
      }

      const where = {
        paymentStatus: "SUCCESS",
      };

      if (Object.keys(dateFilter).length > 0) {
        where.createdAt = dateFilter;
      }

      // Group by user and calculate total donations
      const topDonors = await prisma.donate.groupBy({
        by: ["userId"],
        where,
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
        orderBy: {
          _sum: {
            amount: "desc",
          },
        },
        take: parseInt(limit),
      });

      // Get user details for top donors
      const userIds = topDonors.map((donor) => donor.userId).filter(Boolean);
      const users = await prisma.user.findMany({
        where: {
          id: { in: userIds },
        },
        select: {
          id: true,
          name: true,
          email: true,
          photo: true,
        },
      });

      // Map user details to donations
      const topDonorsWithDetails = topDonors.map((donor) => {
        const user = users.find((u) => u.id === donor.userId);
        return {
          ...donor,
          user: user || null,
        };
      });

      // Also get anonymous donors
      const anonymousDonors = await prisma.donate.groupBy({
        by: ["donorName", "donorEmail"],
        where: {
          ...where,
          isAnonymous: true,
          userId: null,
        },
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
        orderBy: {
          _sum: {
            amount: "desc",
          },
        },
        take: parseInt(limit),
      });

      return res.status(200).json({
        success: true,
        data: {
          topDonors: topDonorsWithDetails,
          anonymousDonors,
        },
      });
    } catch (error) {
      console.error("Get top donors error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }
}

module.exports = DonationController;