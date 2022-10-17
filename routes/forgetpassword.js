const express = require('express');

const router = express.Router();

const forgotPasswordController=require('../controllers/forgetpassword')

router.post('/forgotpassword',forgotPasswordController.getPassword);
router.get('/resetpassword/:id',forgotPasswordController.resetPassword);
router.post('/updatePassword/:id',forgotPasswordController.updatePassword)

module.exports=router