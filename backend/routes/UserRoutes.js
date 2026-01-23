const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserControllers");
const { authenticate, isAdmin } = require("../middlewares/authenticate");

router.post("/", UserController.createUser);
router.get("/profile", authenticate, UserController.getProfile);
router.put("/profile", authenticate, UserController.updateProfile);
router.put("/change-password", authenticate, UserController.changePassword);
router.get("/", authenticate, isAdmin, UserController.getAllUsers);
router.get("/:id", authenticate, isAdmin, UserController.getUserById);
router.put("/:id", authenticate, isAdmin, UserController.updateUser);
router.delete("/:id", authenticate, isAdmin, UserController.deleteUser);
router.put("/:id/role", authenticate, isAdmin, UserController.updateUserRole);
router.put("/:id/verify", authenticate, isAdmin, UserController.verifyUser);
router.get("/:id/donations", authenticate, isAdmin, UserController.getUserDonations);
router.get("/:id/stats", authenticate, isAdmin, UserController.getUserStats);

module.exports = router;