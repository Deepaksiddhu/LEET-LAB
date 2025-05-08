import bcrypt from "bcryptjs";
import {db} from "../libs/db.js"
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import e from "express";


export const register = async (req,res)=>{
    const {name,email,password} = req.body;

    try {
        const existingUser = await db.user.findUnique({
            where:{
                email
            }
        })

        if(existingUser)
        {
            return res.status(400).json({
                error:"User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await db.user.create({
            data:{
                email,
                password:hashedPassword,
                name,
                role:UserRole.USER
            }
        })

        const token = jwt.sign(
            {id:newUser.id},
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        )


        const cookieOptions = {
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
            maxAge:1000*60*60*24*7
        }
        res.cookie("jwt",token,cookieOptions) //send cookie

        res.status(201).json({
            success:true,
            message:"User Registered Successfully",
            user:{
                id:newUser.id,
                name:newUser.name,
                email:newUser.email,
                role:newUser.role,
                image:newUser.image
            }
        })

    } catch (error) {
        console.log("Error in Creating User:",error);
        
        res.status(500).json({
            error:"Error in creating user"
        })
    }
}


export const login = async(req,res)=>{
    const {email,password} = req.body;

    // console.log("REQ Body",req.body); 
    
    try {
        const user = await db.user.findUnique({
            where:{
                email
            }
        })

        if(!user)
        {
            return res.status(401).json({
                error:"User not found"
            })
        }


        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch)
        {
            return res.status(401).json({
                error:"Invalid credentials"
            })
        }

        const token = jwt.sign(
            {id:user.id},
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        )


        const cookieOptions = {
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
            maxAge:1000*60*60*24*7
        }
        res.cookie("jwt",token,cookieOptions) //send cookie


        res.status(200).json({
            success:true,
            message:"User Logged in Successfully",
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
                image:user.image
            }
        })


    } catch (error) {
        console.log("Error  logging in User:",error);
        
        res.status(500).json({
            error:"Error logging in user"
        })
    }
}

export const logout = async(req,res)=>{
    try {
        const cookieOptions = {
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
            maxAge:1000*60*60*24*7
        }
        res.clearCookie("jwt",cookieOptions)

        res.status(200).json({
            success:true,
            message:"User logged out successfully"
        })
    } catch (error) {
        console.log("Error in logging out User:",error);
        
        res.status(500).json({
            error:"Error in logging out  user"
        })
    }
}


export const check = async(req,res)=>{
    try {
        res.status(200).json({
            success:true,
            message:"User authenticated successfully",
            user:req.user
        })
    } catch (error) {
        console.log("Error checking User:",error);
        res.status(500).json({
            error:"Error checking User"
        })
    }
}






