import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt  from 'jsonwebtoken'
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
   phone:{
        type:Number,
        required:true,
    },
    work:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    cpassword:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now()
    },
    avatar:{
        type:String,
        default:'',
        // default:'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg'
    },
    messages:[
       
        {
           email:{
                type:String,
                required:true,
            },
            username:{
                type:String,
                required:true,
            },
           phone:{
                type:Number,
                required:true,
            },
            message:{
                type:String,
                required:true,
            }, 
        }
    ],
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
    

},{timestamps:true})

// userSchema.pre("save",async function (next){
//     if(this.isModified("password")) {
//      this.password=await bcrypt.hash(this.password,10)
//     }
//     if(this.isModified("cpassword")) {
//         this.cpassword=await bcrypt.hash(this.password,10)
//        }
//      next();
// })
// userSchema.methods.isPasswordCorrect=async function (password){
//     return await bcrypt.compare(password,this.password)
// }
userSchema.methods.addMessage=async function(email,phone,username,message){
    try{
        this.messages=this.messages.concat({email,phone,username,message});
    await this.save();
    console.log("this.message is ",this.message);
    return this.message;
    }catch(e){
        console.log("error in addmessage is ",e)
    }

}
export const User=mongoose.model("User",userSchema)