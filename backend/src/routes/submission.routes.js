import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getAllSubmission, getAllSubmissionForProblem, getSubmissionsForProblem } from '../controllers/submission.controller';



const submissionRoutes = express.Router();


submissionRoutes.get('/get-all-submissions',authMiddleware,getAllSubmission);
submissionRoutes.get('/get-submission/:problemId',authMiddleware,getSubmissionsForProblem);
submissionRoutes.get('/get-submission-count/:problemId',authMiddleware,getAllSubmissionForProblem);







export default submissionRoutes;