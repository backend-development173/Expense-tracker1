const Expense=require('../models/expense')
const User = require('../models/expense')
const FilesDownloaded=require('../models/filesDownloaded')

const AWS=require("aws-sdk")


function uploadToS3(data,fileName){

  let s3Bucket = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,
  });

  
    var params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: data,
      ACL: "public-read",
    };
    return new Promise((resolve,reject)=>{
      s3Bucket.upload(params, (err, s3response) => {
        if (err) {
          console.log("something went wrong", err);
          reject(err)
        }
        else {
          console.log("success", s3response);
          resolve(s3response.Location);
        }
      });
    })
    
  
}






exports.addExpense=(req, res,)=>{
    const user=req.user;
    console.log("addExpense",user);
   const {amount,description,category}=req.body;

    Expense.create({
        amount,
        description,
        category,
       userId :req.user.dataValues.id
    
    })
    .then(()=>{
        res.status(201).json({amount,description,category})
    })
    .catch(err=>{
        console.log(err)
        res.status(403).json({success:false,message:'expense not added'})

    })

}

exports.getExpense=(req,res,next)=>{
    req.user.getExpenses()
    .then(expenses=>{
        res.status(200).json({success:true,expenses:expenses, message:"Successfully Added"})
    })
    .catch(err=>{
        console.log(err)
        res.json(err)
    })
}

exports.deleteExpense=(req,res,next)=>{
    const id=req.params.expenseId;
    Expense.destroy({
        where: {
          id: id,
        },
      })
        .then((result) => {
          res.status(200).json({ success: true, message: "deleted Successfully" });
        })
        .catch((err) => {
          res.status(400).json({ success: false, message: "something went wrong" });
        });
    };
    
    exports.deleted



    exports.getAllExpense = (req, res, next) => {
      User.findAll()
        .then((data) => {
      
          res.status(200).json(data);
        })
        .catch((err) => {
          res.status(400).json({ success: false, message: "something went wrong" });
        });
    };

    
exports.downloadExpense=async(req,res,next)=>{

  try{
    const expenses=await User.findAll();
  const stringifiedExpenses=JSON.stringify(expenses);
  const userId=req.user.id;

  const fileName=`Expense${userId}/${new Date()}.txt`;
  const fileUrl=await uploadToS3(stringifiedExpenses,fileName);
  FilesDownloaded.create({
      fileUrl: fileUrl,
      userId:userId,
     
  });
  res.status(200).json({fileUrl,success:true})
  }catch(err){
    console.log(err);
    res.status(500).json({success:false,err})
  }


  

}