const express = require('express')
const router = express.Router()
const { tambahPajakKendaraan, detailPajakKendaraan } = require('../controllers/pajakController')
const { authentication } = require('../middleware/authMiddleware')
const validateAccountMiddleware = require('../middleware/accessMiddleware');

router.post('/add-pajak-kendaraan', tambahPajakKendaraan)
router.get('/detail-pajak-kendaraan/:no_polisi', authentication, validateAccountMiddleware, detailPajakKendaraan)

module.exports = router;