const express = require("express");
const router = express.Router();
const CampaignController = require("../controllers/CampaignControllers");
const { authenticate, isAdmin } = require("../middlewares/authenticate");

router.get("/", CampaignController.getAllCampaigns);
router.get("/:id", CampaignController.getCampaignById);

router.post("/", authenticate, isAdmin, CampaignController.createCampaign);
router.put("/:id", authenticate, isAdmin, CampaignController.updateCampaign);
router.delete("/:id", authenticate, isAdmin, CampaignController.deleteCampaign);
router.get("/:id/stats", authenticate, CampaignController.getCampaignStats);
module.exports = router;
