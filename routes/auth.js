import express from 'express';
import {
  signUp,
  login,
  verifyOtp,
  logout,
  adminCreateUser,loginEmPwd,
   deleteUserByAdmin, deleteMyAccount ,
  toggleUserStatusByAdmin , updateProfile ,
} from '../controllers/userController.js';

import { authenticateUser, isAdmin } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/signUp', signUp);
router.post('/verifyOtp', verifyOtp);
router.post('/login', login);
router.post('/loginEmPwd', loginEmPwd);
router.post('/logout', authenticateUser, logout);
// Admin-only route
router.post('/adminCreateUser', authenticateUser, isAdmin, adminCreateUser);

// 🧑 POST - User deletes their own account
router.post('/deleteAccount/:id', authenticateUser, deleteMyAccount);

// 👑 POST - Admin deletes any user
router.post('/admin/deleteUser/:id', authenticateUser,isAdmin, deleteUserByAdmin);

router.post('/admin/toggleUser/:id', authenticateUser,isAdmin, toggleUserStatusByAdmin);

router.post('/updateProfile', authenticateUser, updateProfile);

export default router;