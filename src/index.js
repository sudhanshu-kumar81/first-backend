import multer from 'multer'
import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config({path:'./.env'})
import connectDB from './db/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRouter from './routes/user.routes.js'
app.use(cookieParser())

const allowedOrigins = ['http://localhost:3001']; 
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Deny the request
    }
  },
  credentials: true // Allow credentials (cookies) to be sent with the request
};
app.use(cors(corsOptions));
// app.options('*',cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use('/users', userRouter)
;connectDB()
const port=3000
app.listen(port,()=>{
  console.log(`app is running on ${port}`)
})