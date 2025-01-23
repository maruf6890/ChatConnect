import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  loginUser,
  logoutUser,
  updateUserById,
  deleteUserById,
  getCurrentuser,
  searchUser,
  addFriend,
 
} from "../controllers/user.controller.js";
import { verifyAuth } from "../Middlewares/auth.middlewares.js";

const router = Router();

// Route for user registration (add new user)
router.post('/registration', createUser);

router.post('/login', loginUser);
router.post('/logout', logoutUser);
// Route to get all users
router.get('/all',verifyAuth, getAllUsers);
router.post('/add',verifyAuth, addFriend);
router.get('/current-user', verifyAuth, getCurrentuser);
router.get('/search', searchUser);
// Route to get a single user by ID
//router.get('/:userId',verifyAuth, getUserById);

// Route to update a user by ID
//router.put('/:userId', updateUserById);

// Route to delete a user by ID
//router.delete('/:userId', deleteUserById);



export default router;
