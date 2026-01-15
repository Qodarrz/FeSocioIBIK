const JwtHelper = require("../helpers/jwt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = JwtHelper.verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau sudah kadaluarsa",
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

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Akun belum diverifikasi",
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Anda tidak memiliki akses",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki izin untuk mengakses resource ini",
      });
    }

    next();
  };
};

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (!["ADMIN", "SUPER_ADMIN"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya admin yang dapat mengakses resource ini",
    });
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  isAdmin,
};
