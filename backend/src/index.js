import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import axios from "axios";



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

const port = process.env.PORT || 4000

// console.log("hello before iffi");


// (async () => {
//     console.log("Starting submission process...");
    
//     const submission = await axios.post("http://localhost:2358/submissions?base64_encoded=false", {
//       source_code: "console.log(3 + 7);",
//       language_id: 63, // JavaScript
//       stdin: "",
//     });
  
//     console.log("Submission:", submission.data);
//     const token = submission.data.token;
  
//     // Wait a bit and fetch result
//     setTimeout(async () => {
//       const result = await axios.get(`http://localhost:2358/submissions/${token}?base64_encoded=false`);
//       console.log("Result:", result.data);
//     }, 2000);
//   })();


app.listen(port,()=>{
    console.log(`Port is listening on port:${port}`);
    
})










