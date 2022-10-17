let user=require('../models/user');
let ForgotPassword=require('../models/password')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const uuid = require('uuid');
const path=require('path');

//  forgot password api when click to enter your email
exports.getPassword=(req,res,next)=>{
    let requestId;
    console.log('10')
    let userEmail=req.body.emailObj;
    user.findOne({
        where:{
            email:userEmail
        }
    }).then(userData=>{
        console.log(userData)
        if(userData){
            requestId = uuid.v4();
            console.log(requestId);
        //    userData.createForgotPassword({id:requestId,isActive:true})
            ForgotPassword.create({
                id:requestId,
                isActive:true,
                UserId:userData.id
            })
        }
    }).then(data=>{
        return res.status(200).json({success:false,message:"Forgot password request created successfully",requestId})
        
    })
    .catch(err=>{
        console.log(err)
        return res.status(400).json({success:false,message:"Something went wrong"})
    })

   
}


exports.resetPassword=(req,res,next)=>{
    let requestId=req.params.id;
    
    ForgotPassword.findOne({
        where: {
            id:requestId
        }
    })
    .then(data=>{
        if(data){
            if(data.isActive==true){
                res.sendFile(path.join(__dirname, '../front-end/passReset/resetpass.html'));
            }else
            return res.status(400).json({success:false,message:"IsActive False, please create the req again"})
        }
    })
    .catch(err=>{
        res.status(400).json({success:false,message:"something went wrong"})
    })

}

exports.updatePassword=(req,res,next)=>{

    console.log(req.params)
    let forgotPasswordData;
    let reqId=req.params.id;
    let newPassword=req.body.password;
    console.log(reqId)
    ForgotPassword.findOne({
        where:{
            id:reqId
        }
    }).then(data=>{
        forgotPasswordData=data;
        console.log(data)
        let userId= data.UserId;
        return user.findOne({
            where:{
                id:userId
            }
        })
    }).then(userRes=>{
        bcrypt.hash(newPassword, saltRounds).then(function(hash){
            return userRes.update({
                    password:hash
                })
            })
    }).then(result=>{
        console.log(forgotPasswordData)
        return forgotPasswordData.update({
           
                isActive:false
           
        })
    })
    .then(data=>{
        console.log(data)
        res.status(200).json({success:true,message:"password updated successfully"})
    })
    .catch(err=>{
        console.log(err)
        res.status(400).json({ success: false, message: 'Something went wrong' })
    })
}


