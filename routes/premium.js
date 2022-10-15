const express=require('express')

const premiumController=require('../controllers/Premium')

const authorization=require('../middleware/authorization')

const router=express.Router()

router.post('/premium/create/order',authorization.authenticate,premiumController.premiumOrderGeneration)
router.post('/transaction/detail',authorization.authenticate,premiumController.updateTransactionDetails)

module.exports=router