import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const connectDB= ()=>{
    mongoose
    .connect(process.env.MONGO_URL)
    .then(()=>{
        console.log(" Connected to mongodb");
    })
    .catch((err) =>{
        console.log(" error connecting to mongodb");
    });
};

export default connectDB;