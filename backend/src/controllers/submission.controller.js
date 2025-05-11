import { use } from "react";
import { db } from "../libs/db";

export const getAllSubmission = async (req, res) => {
    try {
        const userId = req.user.id;
        const submission = await db.submission.findMany({
            where:{
                userId:userId
            }
        })

        res.status(200).json({
            success:true,
            message:"Submission fetched successfully",
            submission
        })
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({
            success:false,
            message:"Error fetching submissions",
            error:error.message
        })
    }
}


export const getSubmissionsForProblem = async (req, res) => {
    try {
        const userId = req.user.id;
        const problemId = req.params.problemId;
        const submission = await db.submission.findMany({
            where:{
                userId:userId,
                problemId:problemId
            }
        })

        res.status(200).json({
            success:true,
            message:"Submission fetched successfully",
            submission
        })
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({
            success:false,
            message:"Error fetching submissions",
            error:error.message
        })
    }
}





export const getAllSubmissionForProblem = async (req, res) => {
    try {
        const problemId = req.params.problemId;

        const submission = await db.submission.count({
            where:{
                problemId:problemId
            }
        })


        res.status(200).json({
            success:true,
            message:"Submission fetched successfully",
            count:submission

        })
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({
            success:false,
            message:"Error fetching submissions",
            error:error.message
        })
        
    }
}

