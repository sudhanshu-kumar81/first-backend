import jwt  from 'jsonwebtoken'
import { User } from '../models/users.models.js';
const authenticate =async (req,res,next) => {
  console.log();
    console.log("arrived in try block of authenticate ")
    try{
      const token=req.cookies.mycookie
      console.log("token in authenticate ",token)
      if(!token){
        console.log("token is not present sention")
        return res.status(401).json({
          success: false,
          message: "missing token"
      })
      }
      console.log("token in cookie is",token);
      try{
        const payload=jwt.verify(token,process.env.SECRET_KEY)
        // console.log("payload is", payload);
        // req.user = payload;
        console.log("payload.id",payload.id);
        console.log("token is ",token);
        const rootUser=await User.findOne({_id:payload.id,"tokens.token":token})
        // console.log("rootuser is",rootUser)
        if(!rootUser){
          return res.status(401).json({
            success: false,
            message: "user not found",
        })
        }
        req.rootUser=rootUser;
        req.token=token;
        req.userID=rootUser._id;
        console.log("passed authentication")
        next();
      }catch(e){
        return res.status(401).json({
          success: false,
          message: "token is invalid",
      })
      }
    }
    catch(err){
      console.log("error in authorization",e);
      return res.status(401).json({
        success: false,
        message: "somethings went wrong while verifying token"
    })
    }
}

export {authenticate}
