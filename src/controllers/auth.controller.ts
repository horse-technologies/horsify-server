import { Response, NextFunction } from "express";
import Users from "../models/user.model";
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import Tokens from "@src/models/token.model";
import { generateTokens, hashToken } from "@src/util/auth.util";
import {
  loginValidation,
  validateResetPassword,
  validateRevokeRefreshToken,
  validateUser,
} from "@src/validations/auth.validation";
import {
  generateResetPasswordEmailText,
  sendEmail,
} from "@src/util/sendEmail.util";

const register = async (req: any, res: Response) => {
  try {
    const userdata = await validateUser.validateAsync(req.body);
    let foundUser: any;
    foundUser = await Users.findOne({ email: userdata.email });
    if (foundUser) {
      if (foundUser.isDeleted === true) {
        foundUser.isDeleted = false;
        foundUser.update(userdata);
      } else {
        return res
          .status(HttpStatusCodes.CONFLICT)
          .json({ error: "User already exists" });
      }
    } else {
      foundUser = new Users(userdata);
    }

    foundUser.password = bcrypt.hashSync(userdata.password, 12);
    await foundUser.save();
    res.json({ message: "Account created successfully" });
  } catch (error) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: error.message });
  }
};

const login = async (req: any, res: Response) => {
  try {
    const { email, password } = await loginValidation.validateAsync(req.body);
    const foundUser = await Users.findOne({
      email: email,
      isDeleted: false,
    }).select("+password");
    if (!foundUser) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        error: "There is no account associated with this email",
      });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(400).json({ error: "Password is incorrect" });

    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(foundUser, jti);
    const data = {
      jti: jti,
      token: hashToken(refreshToken),
      user: foundUser?._id,
    };
    const token = new Tokens(data);
    await token.save();
    await foundUser.save();
    const new_user = await Users.findById(foundUser?._id);
    res.json({
      accessToken,
      refreshToken,
      user: new_user,
    });
  } catch (error) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: error.message });
  }
};

const forgotPassword = async (req: any, res: Response) => {
  try {
    let token;
    const { email } = req.body;
    const foundUser = await Users.findOne({
      email: email,
    });

    if (!foundUser) return res.status(403).json({ error: "Invalid email" });

    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(foundUser, jti);
    const new_token = hashToken(refreshToken);
    const data = {
      jti: jti,
      token: new_token,
      user: foundUser._id,
    };
    token = new Tokens(data);
    await token.save();
    let text = await generateResetPasswordEmailText(refreshToken);

    sendEmail(email, "Password Reset", text);

    res.json({ message: `Email sent sucessfully to ${email}` });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req: any, res: Response) => {
  try {
    const { token, newpassword } = await validateResetPassword.validateAsync(
      req.body
    );
    if (!token) return res.status(400).json({ error: "Missing token." });

    const payload: any = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || "fallbackjwtrefreshsecret"
    );

    const jti = payload.jti;

    const savedToken = await Tokens.findOne({
      jti: jti,
    });
    if (!savedToken || savedToken.revoked == true)
      return res.status(401).json({ error: "Unauthorized" });

    const hashedToken = hashToken(token);
    if (hashedToken !== savedToken.token)
      return res.status(401).json({ error: "Unauthorized" });

    const { user } = savedToken;
    const foundUser = await Users.findOne({
      _id: user,
    });
    if (!foundUser) return res.status(401).json({ error: "User not found" });

    foundUser.password = bcrypt.hashSync(newpassword, 12);
    await foundUser.save();
    await savedToken.updateOne({ revoked: true });
    const new_jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(foundUser, new_jti);
    res.json({
      message: "Password reset successful.",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const genAccessTokenFromRefresh = async (req: any, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ error: "Missing refresh token" });

    const payload: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "fallbackjwtrefreshsecret"
    );
    const savedToken = await Tokens.findOne({
      id: payload.jti,
    });

    const foundUser = await Users.findById(payload.userId);

    if (!foundUser) return res.status(401).json({ error: "Unauthorized" });

    if (!savedToken || savedToken.revoked === true)
      return res.status(401).json({ error: "Unauthorized" });

    const hashedToken = hashToken(refreshToken);

    if (hashedToken !== savedToken.token) {
      res.status(401).json({ error: "Unauthorized" });
    }

    await savedToken.updateOne({ revoked: true });

    const jti = uuidv4();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      foundUser,
      jti
    );
    const data = {
      jti: jti,
      token: hashedToken,
      user: foundUser._id,
    };
    await new Tokens(data).save();

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const revokeRefreshToken = async (req: any, res: Response) => {
  try {
    const { userId } = await validateRevokeRefreshToken.validateAsync(req.body);
    await Tokens.updateOne({ user: userId, revoked: true });
    res.json({ message: `Tokens revoked for user with id ${userId}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  register,
  login,
  revokeRefreshToken,
  forgotPassword,
  resetPassword,
  genAccessTokenFromRefresh,
};
