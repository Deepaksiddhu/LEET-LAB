
import axios from "axios";
export const getJudge0LanguageId = (Language) =>{
    const languageMap = {
        "PYTHON" : 71,
        "JAVA" : 62,
        "JAVASCRIPT" : 63,
    }

    return languageMap[Language.toUpperCase()]
}



const judge0Api = async (endPoint,method,data) =>{
    const options = {
        method: method,
        url: `${process.env.JUDGE0_API_URL}${endPoint}`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${process.env.JUDGE0_API_KEY} `
        },
        data: data
        };

        return await axios.request(options);
}





const sleep = (ms) => new Promise((resolve)=> setTimeout(resolve,ms));



export const poolBatchResult = async (tokens) =>{
    while(true)
    {
        // console.log("Tokens11111:",tokens);
            
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params:{
                tokens:tokens.join(","),
                base64_encoded:false,
            }
        })


        // console.log("Data:",data);

        const results = data.submissions;
        console.log("Results:",results);

        const isAllDone = results.every(
            (res)=> res.status.id !==1 && res.status.id !==2
        )
        console.log("Is All Done:",isAllDone);

        if(isAllDone) return results

        await sleep(1000)

    }
}


export const submitBatch = async (submissions) =>{
    const {data} = await judge0Api("/submissions/batch", "POST", {
        submissions
    })

    // console.log("Submission Results:",data);

    return data // [{token},{token},{token}]
    
}




export function getLanguageName(LanguageId){
    const LANGUAGE_NAMES = {
        74:"TypeScript",
        63:"JavaScript",
        62:"Java",
        71:"Python",
    }
    return LANGUAGE_NAMES[LanguageId] || "Unknown"
}