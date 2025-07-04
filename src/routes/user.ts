import express from 'express';
const router = express.Router();
import {
    changePassword,
    deleteUserById,
    getAllUsers,
    getProfile,
    getUserById,
    setPassword,
    updateImage,
    updateProfile,
    updateUser,
} from '@src/controllers/user.controller';
import { isAuthenticated } from '@src/middlewares/auth.middleware';

router.get('/', isAuthenticated, getAllUsers);
router.get('/:id', isAuthenticated, getUserById);
router.get('/profile/details', isAuthenticated, getProfile);
router.patch('/:id', isAuthenticated, updateUser);
router.patch('/profile/details', isAuthenticated, updateProfile);
router.delete('/:id', isAuthenticated, deleteUserById);
// router.post(
//     '/update/profile/image',
//     isAuthenticated,
//     getDynamicPath('profileimage'),
//     upload.single('profileimage'),
//     updateImage
// );

router.patch('/profile/change-password', isAuthenticated, changePassword);
router.patch('/profile/set-password', setPassword);

export default router;
