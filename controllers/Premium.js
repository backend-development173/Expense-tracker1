const Razorpay=require('razorpay')
const User=require('../models/user')
const Order=require('../models/premiumorder')


exports.premiumOrderGeneration=(req, res, next)=>{
    var instance=new Razorpay({
        key_id:`rzp_test_lpC2F9qqmivBNb`,
     key_secret:'ZfzQJFgPfW2r6sRMcgr4XnbY'
    })
    var options = {
      amount: req.body.amount,  // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11"
    };
    instance.orders.create(options,(err, order)=>{
        if(err){
            console.log(err)
        }
      else  
      res.status(201).json({order})
    })
}

exports.updateTransactionDetails=(req,res,next)=>{
    req.user.update({isPremium:true})
    .then()
    .catch(err=>{
        console.log(err)
        return res.json({error:err})
    })
    req.user.createOrder({
        orderId:req.body.orderId,
        paymentId:req.body.paymentId
    })
    .then()
    .catch(err=>{
        console.log(err)
        res.json({error:err})
    })
}