import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";



import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";

dotenv.config()


const app = express();

app.use(express.json());
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("Hello welcome to leetlab 🔥")
})

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/problems",problemRoutes)

const port = process.env.PORT || 8000

app.listen(port,()=>{
    console.log(`Port is listening on port:${port}`);
    
})









