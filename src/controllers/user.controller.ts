import { NextFunction, Request, Response } from 'express';
import Users from '../models/user.model';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import {
    validateChangePassword, validateUser
} from '@src/validations/auth.validation';
import bcrypt from 'bcrypt';


const getAllUsers = async (req: any, res: Response) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getUserById = async (req: any, res: Response) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user) return res.status(400).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getProfile = async (req: any, res: Response) => {
    try {
        const { userId } = req.payload;
        const user = await Users.findById(userId);
        if (!user) return res.status(400).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


const updateUser = async (req: any, res: Response) => {
    try {
        const id = req.params.id;
        const data = await validateUser.validateAsync(req.body);

        const user = await Users.findByIdAndUpdate(
            id,
            { $set: { ...data } },
            { new: true }
        );
        await user?.save();

        if (user === null)
            return res.status(400).json({ error: 'User details not updated' });
        res.json(user);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const updateProfile = async (req: any, res: Response) => {
    try {
        const { userId } = req.payload;
        const data = await validateUser.validateAsync(req.body);
        const user = await Users.findByIdAndUpdate(
            userId,
            { $set: { ...data } },
            { new: true }
        );
        await user?.save();
        if (user === null)
            return res.status(400).json({ error: 'User details not updated' });
        const finaluser:any = await Users.findById(userId)

        res.json(finaluser);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const deleteUserById = async (req: any, res: Response) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.isDeleted = true;
        await user.save();

        res.json(user);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const updateImage = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.payload;
        const image = req.file;
        const image_url = `${process.env.HOST_URL}/uploads/personal/${userId}/profileimage/${image.filename}`;
        const updateuser: any = await Users.findById(userId);
        updateuser.profile_photo.url = image_url;
        updateuser.profile_photo.fileName = image?.fileName;
        await updateuser.save();

        res.json(updateuser);
    } catch (err) {
        return res
            .status(HttpStatusCodes.BAD_REQUEST)
            .json({ error: err.message });
    }
};


const setPassword = async (req: any, res: Response) => {
    try {
        const { userId, password } = req.body;
        if (!password) {
            return res
                .status(HttpStatusCodes.BAD_REQUEST)
                .json({ error: 'Password is required' });
        }
        const foundUser = await Users.findById(userId).select('+password');
        if (!foundUser)
            return res.status(400).json({ error: 'User not found' });

        foundUser.password = bcrypt.hashSync(password, 12);
        await foundUser.save();
        res.json({ message: 'Password set successfully' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const changePassword = async (req: any, res: Response) => {
    try {
        const { userId } = req.payload;
        const foundUser = await Users.findById(userId).select('+password');
        if (!foundUser)
            return res.status(400).json({ error: 'User not found' });
        const { oldpassword, newpassword } =
            await validateChangePassword.validateAsync(req.body);

        const match = await bcrypt.compare(oldpassword, foundUser.password);
        if (!match) return res.status(404).json({ error: 'Invalid Password' });

        foundUser.password = bcrypt.hashSync(newpassword, 12);
        await foundUser.save();
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


export {
    getAllUsers,
    getUserById,
    getProfile,
    updateUser,
    updateProfile,
    deleteUserById,
    updateImage,
    changePassword,
    setPassword,
};
