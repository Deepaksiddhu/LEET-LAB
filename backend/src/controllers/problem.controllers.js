import {db} from "../libs/db"
import { poolBatchResult, submitBatch } from "../libs/judge0.lib.js";


export const createProblem = async (req,res) =>{
    //going to get all the data from the req body
    const {title,description,difficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolutions,hints, editorial} = req.body;

    //going to check the user role once again (ki ye admin hai ki nahi hai)

    if(req.user.role !== "ADMIN")
    {
        return res.status(403).json({
            error:"You are not allow to create a problem",
            success:false
        })
    }
    //Loop through the each reference solution for different languages

    try {
        for(const [language,solutionCode] of Object.entries(referenceSolutions))
        {
            // Check if the language is supporded by judge0
            //  Get judge0 Language id for the current language
            const languageId = getJudge0LanguageId(language)

            if(!languageId)
            {
                return res.status(400).json({erro:`${language} Language is not supported`,
                    success:false
                })
            }

        //Prepare judge0 submission for all testcases

        const submissions = testcases.map(({input,output})=>({
            source_code:solutionCode,
            language_id:languageId,
            stdin:input,
            expected_output:output,
        })
        ) 

        const submissionResult = await submitBatch(submissions) // submit the batch to judge0 

        const tokens = submissionResult.map((res)=> res.token) // returned by the judge0 (when we call the api /submissions/batch?base64_encoded=false)

        const results = await poolBatchResult(tokens)// get the results token and the check the status of the tokens (which is not == 1,2) and then run again after the sleep time

        for(let i=0;i<results.length;i++)
        {
            const result = results[i];

            if(result.status.id !==3)
            {
                return res.status(400).json({
                    error:`Testcase ${i+1} failed for language ${language}`,
                    success:false
                })
            }
        }

        //save the problem into the database

        const newProblem = await db.problem.create({
            data:{
                title,description,difficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolutions,hints, editorial,
                userId:req.user.id
            }
        });

        return res.status(200).json(newProblem)


        }
    } catch (error) {
        console.log("Error creating problem:",error);
        return res.status(500).json({
            error:"Error creating problem",
            success:false
        })
        
    }

    
}


export const getAllProblems = async (req,res) =>{

}



export const updateProblem = async (req,res) =>{

}


export const getProblemById = async (req,res) =>{

}


export const  deleteProblem = async (req,res) =>{

}


export const getAllProblemsSolveByUser = async (req,res) =>{

}