import PostModel from "../Models/postModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";
// create new post

export const createPost = async (req, res) => {
    console.log(req.body, "request in post create");
    
    const user = await UserModel.findById(req.body.userId)
    console.log(user,"userrsr");
    const newPost = new PostModel(req.body);
    console.log("newpost",newPost);
  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await PostModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find();
        console.log("insidedmmmmmm");
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json(error);
    

    };
}

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const { userId, ...updatedData} = req.body;
  try {
      const post = await PostModel.findById(id);
      if (!post) {
          res.status(404).json("post not found")
      }
      if (post.userId !== userId) { 
          res.status(403).json("action forbidden")
      }

   
      const updatedPost = await PostModel.findByIdAndUpdate(id,updatedData,{new:true})
      res.status(200).json(updatedPost);
    
  } catch (error) {
    res.status(500).json(error);
  }
};


export const deletePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;
    try {
        const post = await PostModel.findById(id);
        if (post.userId === userId) {
            await post.deleteOne();
            res.status(200).json("post deleted successfully")
        }
        else {
            res.status(403).json("action forbidden");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

export const likePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;
    try {
        const post = await PostModel.findById(id);
        console.log(";ikes", post);
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }
        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } })
            res.status(200).json("liked a post");
        } else {
            await post.updateOne({ $pull: { likes: userId } })
              res.status(200).json("unliked a post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
}
// get timeline post

export const getTimelinePosts = async (req, res) => {
    const userId = req.params.id;
    try {
        // currentuserpost is the post of the user based on the userid of the user in the postmodel.
        // the user can view post of the users they follow.. so to watch the post, the userid on the post 
        // should match with the userid in the following array.. so we need to agrgrate userModel, following with postModel, userId
        const currentUserPost = await PostModel.find({ userId: userId });
        const followingPosts = await UserModel.aggregate([
            {
                $match: {
                _id:new mongoose.Types.ObjectId(userId)
                }
            },
                {
                    $lookup: {
                        from: "posts",
                        localField: "following",
                        foreignField: "userId",
                        as:"followingPosts"
                        
                    }
            }, {
                    $project: {
                    followingPosts: 1,
                        _id:0
                    }
                }
            
           
        ])

        res.status(200).json(currentUserPost.concat(...followingPosts[0].followingPosts)
            .sort((a, b) => {
                return b.createdAt - a.createdAt;
        }))
    } catch (error) {
        res.status(500).json(error);
    }

}