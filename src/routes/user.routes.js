import { Router } from "express"
import { registerUser } from "../controller/user.controller.js"
import { login } from "../controller/login.controllers.js"
import { authenticate } from "../middlewares/authenticate.js"
import { User } from "../models/users.models.js"
import {upload} from '../middlewares/multer.js'
import { uploadOncloudinary } from "../middlewares/cloudinary.js"
const router=Router()
router.post('/register',registerUser)
router.post('/login',login)
//protected routes
router.get('/about',authenticate,async(req,res)=>{
   console.log("hello my about");
   res.send({
      rootUser:req.rootUser,
      success:true,
      message:"you are authorized"
   })
})
router.get('/getdata',authenticate,async(req,res)=>{
   res.status(200).send({
      rootUser:req.rootUser,
      success:true,
      message:"you are authorized"
   })
})
router.post('/contact',authenticate,async(req,res)=>{
   console.log()
   console.log("arrived in backend after authenticate")
     try{
      const  {username,email,phone,message}=req.body;
   if(!email||!phone||!message||!username){
     return res.status(403).send({
         success:false,
         message:"enter all field"
      })
   } 
    const user=await User.findOne({_id:req.userID})
    console.log("user is ",user)
    if(user){
      const response=await user.addMessage(email,phone,username,message)
      await user.save();
      console.log("user is",user);
      res.status(200).json({
         success:true,
         message:"messages added successfully",
         user:user
      })
    }
     }catch(e){
     console.log("error block of /contact ",e);
     return  res.status(500).json({
      success:false,
      message:"error while saving your message"
   })
     }

})
router.get('/logout',(req,res)=>{
   console.log('Cookies: ', req.cookies)
   console.log("hello my logout page")
   if(req.cookies){
      res.clearCookie('mycookie');
      // res.redirect('/login')
      res.status(200).send({
         message:"logged out successfully",
         success:true,
      })
   }else{
     return res.status(200).send({
      message:"Already logged out",
      success:false,
   }) 
   }
   
   
})
router.get('/islogin',authenticate,async(req,res)=>{
  try{
   res.status(200).send({
      token: req.token,
      success:true,
      message:"ok"
   })
  }catch(e){
    return res.status(500).send({
      success:true,
      message:"internal error"
   })
  }
})

router.post('/profile',authenticate, upload.single('avatar'), async (req, res, next) =>{
   // req.file is the `avatar` file
   // req.body will hold the text fields, if there were any
   try{
   console.log("do i have url");
   const localFilePath=req.file.path;
   console.log("localFilePath is ",localFilePath)
   console.log("req.file is ",req.file);
   const cloudinaryResponse =await uploadOncloudinary(localFilePath);
   if(cloudinaryResponse){
    console.log("cloudinaryResponse is ",cloudinaryResponse);
    try{
      const user=await User.findByIdAndUpdate(req.userID,{avatar:cloudinaryResponse.url},{new:true});
      console.log("user is ",user);
      res.status(200).json({
         success:"true",
         message:"database updated successfully",
         user:user
      })
    }catch(e){
    console.log("error is ",e);
    return res.status(500).json({
        success:false,
        message:"error in updating data base"
    })
    }
    console.log("user is ",user);
     res.status(200).json({
      success:true,
      message:"uploaded file successfully",
      url:cloudinaryResponse.url

     })
   }else{
      res.status(500).json({
         success:false,
         message:"error in uploading  file to cloudinary"
      })
   }
   }catch(e){
      return res.status(500).json({
         success:false,
         message:"internal error"
      })
   }
 })


 router.get('/getprofile',authenticate,async(req,res)=>{
   try{
      const user=await User.findById(req.userID)
      if(user){
         console.log("you get user for getprofile route",user)
         res.status(200).send({
            user: user,
            success:true,
            message:"get the user"
         })
      }else{
         res.status(403).send({
            message:"can`t get user",
            success:false,
         })
      }
   
   }catch(e){
     return res.status(500).send({
       success:false,
       message:"internal error"
    })
   }
 })
export default router
