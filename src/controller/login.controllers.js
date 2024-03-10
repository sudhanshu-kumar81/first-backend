
import { User } from "../models/users.models.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
    const login=async(req,res)=>{
    try {
        console.log("i am body of login", req.body)
        const { email, password } = req.body
        console.log("email is", email)
        console.log("passwod id ", password)
        if ([email, password].some(field => field?.trim() === "")) {
            return res.status(400).json({
                success: false,
                message: "enter all credientials"
            })
        }
        const existedUser = await User.findOne({ email })
        console.log("existed user  is ", existedUser)
        if (!existedUser) {
            return res.status(404).json({
                success: false,
                message: "you didnot have account with this email"
            })
        }
        if (existedUser) {
            console.log("password is going for match")
            console.log("password is ", password)
            console.log("password of existed user", existedUser.password)
            const ismatch = await bcrypt.compare(password, existedUser.password)
            console.log("is password match", ismatch)
            if (ismatch) {
                let token = jwt.sign({
                    id: existedUser._id
                }, process.env.SECRET_KEY, { expiresIn: '10h' })
                //here i want to add my token my models User whwere token array is there
                console.log("token is", token)
             existedUser.tokens = existedUser.tokens.concat({ token: token });
                await existedUser.save();
                console.log("existed user is ",existedUser)
                
                console.log("token is about to push")
                 res
                   .cookie("mycookie", token, {
                     httpOnly: true,
                     expires: new Date(Date.now() + 8 * 3600000)
                   })
                   .status(200)
                   .json({ message: "user Logged in successfully", success: true});
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: "password didnot match"
                })
            }

        }
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: "internal error"
        })
    }






}
export { login }