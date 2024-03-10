import mongoose from "mongoose"
const connectDB=async()=>{
    try{
       const connectionInstace=await mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`)
       console.log("mongo DB connected !! DB HOST-",connectionInstace.connection.host)
    }
    catch(error){
       console.log("error in connection with mongoose")
       console.log(error);
       process.exit(1);
    }
}
export default connectDB