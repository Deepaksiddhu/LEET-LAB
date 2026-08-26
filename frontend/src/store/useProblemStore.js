import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from 'react-hot-toast';



export const useProblemStore = create((set)=>({
    problems:[],
    problem:null,
    solvedProblems:[],
    isProblemsLoading:false,
    isProblemLoading:false,


    getAllProblems:async()=>{
        try {
            set({isProblemsLoading:true})

            const res = await axiosInstance.get("/problems/get-all-problems");

            set({problems:res.data.problems})

        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Error in getting all problems";
            toast.error(errorMessage)
        }
        finally{
            set({isProblemsLoading:false})
        }
    },

    getProblemById:async(id)=>{
        try {
            set({isProblemLoading:true})

            const res = await axiosInstance.get(`/problems/get-problem/${id}`)

            set({problem:res.data.problem})
            // toast.success(res.data.message)


        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Error fetching problem";
            toast.error(errorMessage)
        }
        finally{
            set({isProblemLoading:false})
        }
    },

    getSolvedProblemByUser:async() =>{
        try {
            const res = await axiosInstance.get("/problems/get-solved-problems")
            set({solvedProblems:res.data.problems})
            
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Error in getting solved problems";
            toast.error(errorMessage)
        }
    },

    deleteProblem:async(id) => {
        try {
            const res = await axiosInstance.delete(`/problems/delete-problem/${id}`);
            toast.success(res.data.message);
            set((state) => ({
                problems: state.problems.filter((problem) => problem.id !== id)
            }));
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Error deleting problem";
            toast.error(errorMessage);
        }
    }

}))