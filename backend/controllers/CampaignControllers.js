const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CampaignController {
  // Get all campaigns with donation summary (Public)
  static async getAllCampaigns(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status = 'ACTIVE', // Default hanya yang aktif
        category,
        type,
        province,
        city,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Build filter
      const where = {
        status: status.toUpperCase()
      };
      
      if (category) where.category = category.toUpperCase();
      if (type) where.type = type.toUpperCase();
      if (province) where.province = province;
      if (city) where.city = city;
      
      // Search functionality
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } }
        ];
      }

      // Get campaigns with pagination
      const [campaigns, total] = await Promise.all([
        prisma.campaign.findMany({
          where,
          include: {
            _count: {
              select: {
                donations: {
                  where: {
                    paymentStatus: "SUCCESS",
                  },
                },
                news: true,
              },
            },
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip,
          take: parseInt(limit),
        }),
        prisma.campaign.count({ where }),
      ]);

      // Get total donation amounts for each campaign
      const campaignIds = campaigns.map((c) => c.id);
      const donationTotals = await prisma.donate.groupBy({
        by: ["campaignId"],
        where: {
          campaignId: { in: campaignIds },
          paymentStatus: "SUCCESS",
        },
        _sum: {
          amount: true,
        },
      });

      // Map donation totals to campaigns
      const campaignsWithTotals = campaigns.map((campaign) => {
        const donation = donationTotals.find((d) => d.campaignId === campaign.id);
        const totalDonated = Number(donation?._sum.amount || 0);
        
        return {
          id: campaign.id,
          name: campaign.name,
          description: campaign.description,
          excerpt: campaign.description.substring(0, 150) + '...',
          location: campaign.location,
          province: campaign.province,
          city: campaign.city,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          status: campaign.status,
          targetDonation: campaign.targetDonation,
          imageUrl: campaign.imageUrl,
          category: campaign.category,
          type: campaign.type,
          totalDonated,
          totalDonors: campaign._count.donations,
          newsCount: campaign._count.news,
          progress: campaign.targetDonation
            ? (totalDonated / Number(campaign.targetDonation)) * 100
            : null,
          isCompleted: campaign.targetDonation 
            ? totalDonated >= Number(campaign.targetDonation)
            : false,
          daysLeft: campaign.endDate 
            ? Math.max(0, Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)))
            : null,
          createdAt: campaign.createdAt,
          updatedAt: campaign.updatedAt
        };
      });

      return res.status(200).json({
        success: true,
        data: {
          campaigns: campaignsWithTotals,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
          },
          filters: {
            status,
            category,
            type,
            province,
            city
          }
        },
      });
    } catch (error) {
      console.error("Get campaigns error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // Get campaign by ID with detailed info (Public)
  static async getCampaignById(req, res) {
    try {
      const { id } = req.params;
      const { 
        includeDonations = "false", 
        donationsLimit = 10,
        includeNews = "false",
        newsLimit = 5
      } = req.query;

      const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              donations: {
                where: {
                  paymentStatus: "SUCCESS",
                },
              },
              news: {
                where: {
                  isPublished: true
                }
              },
            },
          },
        },
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: "Campaign tidak ditemukan",
        });
      }

      // Get recent donations if requested
      let recentDonations = [];
      if (includeDonations === "true") {
        recentDonations = await prisma.donate.findMany({
          where: {
            campaignId: id,
            paymentStatus: "SUCCESS",
          },
          include: {
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
          take: parseInt(donationsLimit),
        });
      }

      // Get recent news if requested
      let recentNews = [];
      if (includeNews === "true") {
        recentNews = await prisma.news.findMany({
          where: {
            campaignId: id,
            isPublished: true,
          },
          select: {
            id: true,
            title: true,
            excerpt: true,
            imageUrl: true,
            publishedAt: true,
            slug: true,
            viewCount: true,
          },
          orderBy: {
            publishedAt: "desc",
          },
          take: parseInt(newsLimit),
        });
      }

      // Get donation statistics
      const donationStats = await prisma.donate.aggregate({
        where: {
          campaignId: id,
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

      // Get top donors
      const topDonors = await prisma.donate.groupBy({
        by: ["userId"],
        where: {
          campaignId: id,
          paymentStatus: "SUCCESS",
          isAnonymous: false,
          userId: { not: null },
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
        take: 5,
      });

      // Get user details for top donors
      const userIds = topDonors.map((donor) => donor.userId).filter(Boolean);
      const topDonorUsers = await prisma.user.findMany({
        where: {
          id: { in: userIds },
        },
        select: {
          id: true,
          name: true,
          photo: true,
        },
      });

      const topDonorsWithDetails = topDonors.map((donor) => {
        const user = topDonorUsers.find((u) => u.id === donor.userId);
        return {
          totalAmount: donor._sum.amount,
          donationCount: donor._count.id,
          user: user || null,
        };
      });

      // Calculate days left
      const daysLeft = campaign.endDate 
        ? Math.max(0, Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)))
        : null;

      return res.status(200).json({
        success: true,
        data: {
          campaign: {
            ...campaign,
            daysLeft
          },
          statistics: {
            totalDonated: donationStats._sum.amount || 0,
            totalDonors: donationStats._count.id || 0,
            averageDonation: donationStats._avg.amount || 0,
            largestDonation: donationStats._max.amount || 0,
            progress: campaign.targetDonation
              ? (Number(donationStats._sum.amount || 0) / Number(campaign.targetDonation)) * 100
              : null,
            isTargetReached: campaign.targetDonation 
              ? Number(donationStats._sum.amount || 0) >= Number(campaign.targetDonation)
              : false,
          },
          recentDonations,
          recentNews,
          topDonors: topDonorsWithDetails,
        },
      });
    } catch (error) {
      console.error("Get campaign by ID error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // ADMIN: Create new campaign
  static async createCampaign(req, res) {
    try {


      const {
        name,
        description,
        location,
        province,
        city,
        startDate,
        endDate,
        targetDonation,
        imageUrl,
        category,
        type = 'CHARITY',
        status = 'DRAFT'
      } = req.body;

      // Validation
      if (!name || !description || !location) {
        return res.status(400).json({
          success: false,
          message: "Nama, deskripsi, dan lokasi wajib diisi",
        });
      }

      // Validate dates
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : null;
      
      if (end && end <= start) {
        return res.status(400).json({
          success: false,
          message: "Tanggal berakhir harus setelah tanggal mulai",
        });
      }

      // Create campaign
      const campaign = await prisma.campaign.create({
        data: {
          name,
          description,
          location,
          province,
          city,
          startDate: start,
          endDate: end,
          targetDonation: targetDonation ? parseFloat(targetDonation) : null,
          imageUrl,
          category: category.toUpperCase(),
          type: type.toUpperCase(),
          status: status.toUpperCase(),
        },
      });

      return res.status(201).json({
        success: true,
        message: "Campaign berhasil dibuat",
        data: campaign,
      });
    } catch (error) {
      console.error("Create campaign error:", error);
      
      if (error.code === 'P2002') {
        return res.status(400).json({
          success: false,
          message: "Nama campaign sudah digunakan",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // ADMIN: Update campaign
  static async updateCampaign(req, res) {
    try {

      const { id } = req.params;
      const updateData = req.body;

      // Check if campaign exists
      const existingCampaign = await prisma.campaign.findUnique({
        where: { id },
      });

      if (!existingCampaign) {
        return res.status(404).json({
          success: false,
          message: "Campaign tidak ditemukan",
        });
      }

      // Convert dates if provided
      if (updateData.startDate) {
        updateData.startDate = new Date(updateData.startDate);
      }
      if (updateData.endDate) {
        updateData.endDate = new Date(updateData.endDate);
      }

      // Convert enum values to uppercase
      if (updateData.category) updateData.category = updateData.category.toUpperCase();
      if (updateData.type) updateData.type = updateData.type.toUpperCase();
      if (updateData.status) updateData.status = updateData.status.toUpperCase();

      // Update campaign
      const updatedCampaign = await prisma.campaign.update({
        where: { id },
        data: updateData,
      });

      return res.status(200).json({
        success: true,
        message: "Campaign berhasil diupdate",
        data: updatedCampaign,
      });
    } catch (error) {
      console.error("Update campaign error:", error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: "Campaign tidak ditemukan",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // ADMIN: Delete campaign (soft delete by changing status to ARCHIVED)
  static async deleteCampaign(req, res) {
    try {
      const { id } = req.params;

      // Check if campaign exists
      const existingCampaign = await prisma.campaign.findUnique({
        where: { id },
      });

      if (!existingCampaign) {
        return res.status(404).json({
          success: false,
          message: "Campaign tidak ditemukan",
        });
      }

      // Check if campaign has donations
      const donationCount = await prisma.donate.count({
        where: {
          campaignId: id,
          paymentStatus: "SUCCESS",
        },
      });

      if (donationCount > 0) {
        // Soft delete by archiving
        await prisma.campaign.update({
          where: { id },
          data: {
            status: "ARCHIVED",
          },
        });

        return res.status(200).json({
          success: true,
          message: "Campaign telah diarsipkan karena sudah memiliki donasi",
        });
      }

      // Hard delete if no donations
      await prisma.campaign.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: "Campaign berhasil dihapus",
      });
    } catch (error) {
      console.error("Delete campaign error:", error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: "Campaign tidak ditemukan",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  }

  // ADMIN: Get campaign statistics
  static async getCampaignStats(req, res) {
    try {

      const { id } = req.params;

      const [
        campaign,
        dailyDonations,
        categoryStats,
        statusStats,
        recentActivity
      ] = await Promise.all([
        // Campaign info
        prisma.campaign.findUnique({
          where: { id },
          include: {
            _count: {
              select: {
                donations: {
                  where: { paymentStatus: "SUCCESS" }
                },
                news: true
              }
            }
          }
        }),

        // Daily donations (last 30 days)
        prisma.donate.groupBy({
          by: ['createdAt'],
          where: {
            campaignId: id,
            paymentStatus: "SUCCESS",
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          },
          _sum: {
            amount: true
          },
          _count: {
            id: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }),

        // Donations by category (if multiple campaigns in future)
        prisma.donate.groupBy({
          by: ['campaignId'],
          where: {
            paymentStatus: "SUCCESS"
          },
          _sum: {
            amount: true
          },
          orderBy: {
            _sum: {
              amount: 'desc'
            }
          },
          take: 10
        }),

        // Campaign status distribution
        prisma.campaign.groupBy({
          by: ['status'],
          _count: {
            id: true
          }
        }),

        // Recent activity
        prisma.donate.findMany({
          where: {
            campaignId: id,
            paymentStatus: "SUCCESS"
          },
          include: {
            user: {
              select: {
                name: true,
                photo: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        })
      ]);

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: "Campaign tidak ditemukan"
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          campaign,
          statistics: {
            dailyDonations,
            categoryStats,
            statusStats,
            recentActivity
          }
        }
      });
    } catch (error) {
      console.error("Get campaign stats error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server"
      });
    }
  }
}

module.exports = CampaignController;