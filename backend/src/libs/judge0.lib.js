export const getJudge0LanguageId = (Language) =>{
    const languageMap = {
        "PYTHON" : 71,
        "JAVA" : 62,
        "JAVASCRIPT" : 63,
    }

    return languageMap[Language.toUpperCase()]
}



export const submitBatch = async (submissions) =>{
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
        submissions
    })

    console.log("Submission Results:",data);

    return data // [{token},{token},{token}]
    
}


const sleep = (ms) => new Promise((resolve)=> setTimeout(resolve,ms))

export const poolBatchResult = async (tokens) =>{
    while(true)
    {
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params:{
                token:tokens.join(","),
                base64_encoded:false,
            }
        })

        const results = data.submissions;

        const isAllDone = results.every(
            (res)=> res.status.id !==1 && res.status.id !==2
        )

        if(isAllDone) return results

        await sleep(1000)

    }
}