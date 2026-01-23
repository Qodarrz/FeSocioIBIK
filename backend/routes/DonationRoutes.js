const express = require('express');
const router = express.Router();
const DonationController = require('../controllers/DonationControllers');
const { authenticate, authorize } = require('../middlewares/authenticate');

router.get('/statistics', DonationController.getDonationStatistics);
router.get('/top-donors', DonationController.getTopDonors);
router.get('/:id', DonationController.getDonationById);

router.post('/', authenticate, DonationController.createDonation);
router.get('/my/donations', authenticate, DonationController.getMyDonations);
router.post('/:id/upload-proof', authenticate, DonationController.uploadPaymentProof);

router.get('/', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), DonationController.getAllDonations);
router.put('/:id/status', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), DonationController.updateDonationStatus);

module.exports = router;