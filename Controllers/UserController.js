import UserModel from "../Models/userModel.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const getAllUsers = async (req, res) => {
  try {
    let users = await UserModel.find();
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc
      return otherDetails
    })
    res.status(200).json(users)
  } catch (error) {
    console.log(error);
  }
};
//get a user
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json({ message: "no user found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateUser = async (req, res) => {
  console.log("haaaaaaaaaiii");
  const id = req.params.id;
  const { _id, password, formData } = req.body;
  console.log(formData, "_id");
  console.log(id, "id");
  if (id === _id) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await UserModel.findByIdAndUpdate(id, formData, {
        new: true,
      });
      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT_KEY,{expiresIn:"1hr"}
      );
      res.status(200).json({ user,token });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(403).json("Access denied, you can only update your own profile");
  }
};


export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;
  if (currentUserId === id || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("user deleted succesfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access denied, you can only update your own profile");
  }
};

export const followUser = async (req, res) => {
  // id is the id of the person I am following and _id is me.
  const id = req.params.id;
  console.log("req.params",req.params.id);
  const { _id } = req.body;
  console.log("_id",_id);
  if (id === _id) {
    res.status(403).json("action forbidden");
  } else {
    try {
      const followerUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (!followerUser.followers.includes(_id)) {
        await followerUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("user followed");
      } else {
        res.status(403).json("you already following this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};


export const unFollowUser = async (req, res) => {
  const id = req.params.id;
  console.log("123432524", id);
  const { _id } = req.body;
  console.log(_id);
  if (id === _id) {
    res.status(403).json("action forbidden");
  } else {
    try {
      const followerUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);
      if (followerUser.followers.includes(_id)) {
        await followerUser.updateOne({ $pull: { followers: _id } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("user unfollowed");
      } else {
        res.status(403).json("user is not followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

