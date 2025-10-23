import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { create, getPosts, deletepost,getPost,updatepost } from '../controllers/post.controller.js';


const router = express.Router();

router.post('/create',verifyToken, create);
router.get('/getposts', getPosts);
router.get('/getpost/:postId', getPost);
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)
export default router;