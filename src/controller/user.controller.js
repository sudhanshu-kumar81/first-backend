import { User } from "../models/users.models.js"
import bcrypt from 'bcrypt'
const registerUser=async(req,res)=>{
    try{
        console.log("i am data of body before submitting",req.body)
        const {username ,email ,phone ,work, password ,cpassword}=req.body;
  if([username,email,phone,work,password,cpassword].some((field)=>field?.trim()==="")){
            return res.status(403).json({
                success:false,
                message:"enter all credientials"
            })
        }
        const existedUser= await User.findOne({
            $or:[{email}]
        })
        if(existedUser){
            return res.status(409).json({
                success:false,
                message:"User with email already exist"
            })
        }
        if(password!==cpassword){
            return res.status(409).json({
                success:false,
                message:"password didnot match"
            })
            
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const user=await User.create({
            username,
            email,
            phone,
            work,
            password:hashedPassword,
            cpassword:hashedPassword
        })
        // console.log("i am data of body after submitting",req.body)
        
        // const createduser=await User.findById(user._id).select(
        //     "-password -cpassword"
        // )
        // console.log("createduser is ",createduser);
        // if(!createduser){
        //     return res.status(409).json({
        //         success:false,
        //         message:"somethong went wrong while registering data"
        //     })
        // }
        if(!user){
                return res.status(500).json({
                success:false,
                message:"somethong went wrong while registering data"
            })
        }
         res.status(200).json(
             {   success:true,
                message:"user registered successfully",
                user:user
             }
           )

    }catch(e){
        console.log("error is",e);
        return res.status(500).json({
            success:false,
            message:"internal error"
        })
    }
}
export {registerUser}