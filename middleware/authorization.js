const user=require('../controllers/auth.js')
const jwt=require('jsonwebtoken');
const User = require('../models/user.js');

const authenticate=(req,res,next)=>{
    const token=req.header('Authorization');
    const user=jwt.verify(token,'shhhhh');
    User.findByPk(user.id).then(data=>{
        req.user=data;
        next();
    }).catch(err=>{
        res.status(401).json({success:false})
    })
}
module.exports={authenticate}