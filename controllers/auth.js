const User=require('../models/user');
const bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

exports.register=(req,res,next)=>{
   const {name,email,password,phone}=req.body

   bcrypt.hash(password,10, (err,hash)=>{

       User.findAll({where:{email:email}})
       .then(users=>{
           const user=users[0]
           if(user)
           res.json({success:false,message:'User Already exist. Please Login'})
           else
           {   
               User.create({
                   name:name,
                   email:email,
                   password:hash,
                   phone:phone
               })
               .then(()=>{
                   res.status(200).json({success:true,message:'Successfully Signed Up, Login now'})
               })
               .catch(err=>{
                   console.log(err)
                   res.json({success:false,message:'error while registering'})
               })

           }
       })
   })
}

// exports.addUser=(req,res,)=>{
//    const userName=req.body.userName;
//    const userMail=req.body.userMail;
//    const userPassword=req.body.userPassword;
//    const userphone  = req.body.phone;
//    bcrypt.hash(userPassword, saltRounds).then(function(hash) {
//       return user.create({name:userName,
//          email:userMail,
//          password:hash ,
//          phone:userphone
//          })
//    }).then(res=>{
//       return res.status(200).json({success:true,message:'User Created'})
//    }).catch(err=>{
//       return res.status(400).json({success:false,message:'something went wrong'})   
//    });

  
// }

function generateWebToken(id){
   return jwt.sign({ id: id }, 'shhhhh');
}

exports.loginUser=(req,res,next)=>{
   const userMail=req.body.userMail;
   const userPassword=req.body.userPassword;
   User.findOne({
      where:{
         email:userMail
      }
   }).then(result=>{
         bcrypt.compare(userPassword, result.password).then(function(Cresult) {
              if(Cresult==true){
               console.log(result.dataValues);
             
               res.status(200).json({success:true,message:'User Log in Successful',token:generateWebToken(result.dataValues.id)})
              }else
              {
                 res.status(401).json({success:false,message:'User Not Authorized'})
              }
         })      
   }).catch(err=>{
      res.status(404).json({success:false,message:'User Not Found'})
   })
}
