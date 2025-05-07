import e from "express";
import { poolBatchResult, submitBatch } from "../libs/judge0.lib.js";

export const executeCode = async (req,res) =>{
    try {

        const {source_code,language_id,stdin,expected_outputs,problemId} = req.body;
        console.log("Req Body for EXECUTE_CODE:",req.body);
        

        const userId = req.user.id;
        console.log("User ID EXECUTE-CODE:",userId);

        //1.//validate testcases 
        if(!Array.isArray(stdin) || stdin.length ===0 
        || !Array.isArray(expected_outputs) || expected_outputs.length !== stdin.length)
        {
            console.log("Invalid testcases");
            return res.status(400).json({
                error:"Invalid testcases",
                success:false
            })
        }

        console.log("Testcases are valid");
        

        //2.//Prepare each testcase for judge0 batch submission
        const submissions = stdin.map((input)=>({
            source_code,
            language_id,
            stdin:input,
            
        }) 
    )
    console.log("Submissions:",submissions);

    //3.//Send this batch of submissions to judge0
    const submitResponse = await submitBatch(submissions)

    console.log("Submit Response:", submitResponse);

    const tokens = submitResponse.map((res)=> res.token);
    console.log("Tokens:", tokens);


    //4.//Pool judge0 for result of all submitted test cases
    const result  = await poolBatchResult(tokens);

    console.log("Result-----------------------------------:")
    console.log(result);
    
    //5.// Analyze the testcase results
    let allPassed = true;
    const detailedResults = result.map((result,i)=>{
        const stdout = result.stdout?.trim();
        const expected_output = expected_outputs[i]?.trim();
        const passed = stdout === expected_output;


        // console.log(`Testcase ${i+1} `);
        // console.log(`Input: ${stdin[i]}`);
        // console.log(`Expected Output for testcase : ${expected_outputs[i]}`);
        // console.log(`Actual Output for testcase : ${stdout}`);

        // console.log(`Matched :${passed}`);

        return{
            testCase:i+1,
            passed,
            stdout,
            expected:expected_output,
            stderr:result.stderr || null ,
            compile_output:result.compile_output || null,
            status:result.status.description,
            memory:result.memory? `${result.memory} KB` : undefined,
            time:result.time ? `${result.time} s` : undefined,
        }
        
    })

    console.log("DetailedResults--------",detailedResults);
    
    //6.// Store Submission summary in db
    


    res.status(200).json({
        success:true,
        message:"Code executed successfully",
    })

    } catch (error) {
        console.log("Error in executing code",error);
        res.status(500).json({
            error:"Error in executing code",
            success:false
        })
        
    }
}