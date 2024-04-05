import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config()
console.log("inside authController");
export const registerUser = async (req, res) => {
    const { username, password, firstname, lastname } = req.body;
    console.log("username",username);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt)
    try {
         const oldUser = await UserModel.findOne({ username });
         if (oldUser) {
           return res.status(400).json({ message: "user already exist" });
         }
         const newUser = new UserModel({
           username,
           password:hashedPassword,
           firstname,
           lastname,
         });
       
        const user = await newUser.save()
        const token = jwt.sign(
          {
            username: user.username,
            id: user._id,
          },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
       return res
         .status(200)
         .json({ message: "User logged in successfully", user,token });

    } catch (error) {
        res.status(500).json({ error: error })
    }
}

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({ username: username })
        if (user) {
            const validity = await bcrypt.compare(password, user.password)

            if (!validity) {
                res.status(400).json("wrong Password")
            }
            else {
                const token = jwt.sign(
                  {
                    username: user.username,
                    id: user._id,
                  },
                  process.env.JWT_KEY,
                  { expiresIn: "1h" }
                ); 
                return res
                  .status(200)
                  .json({
                    message: "User logged in successfully",
                    user,
                    token
                  });
            }
        }
        else {
            res.status(404).json("user doesnot exist")
        }
    } catch (error) {
        res.status(500).json({error:error})
    }
}