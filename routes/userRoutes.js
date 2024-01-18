const express = require('express')
const router = express.Router()
const multer = require('multer');
const { registerUser, loginUser, getUser, validateAccount } = require('../controllers/userController')
const { authentication } = require('../middleware/authMiddleware')
const uploadImage = require('../middleware/imageMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/', authentication, getUser)

router.put('/validate-account', authentication, uploadImage('ktp').single('ktp'), validateAccount);

module.exports = router;