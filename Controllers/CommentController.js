
import CommentModel from "../Models/commentModel.js";
export const createComment = async (req, res) => {
    console.log("inside comment",req.body);
    try {

        const { content, userId ,postId} = req.body;
        // const postId = req.params.postId;
        console.log(postId,"postid");
        const data = new CommentModel({
            postId,
            userId,
            content
        }) 
        const comment = await data.save();
        res.status(200).json({comment})

    } catch (error) {
        console.log(error);
    }
    
}

export const getAllComments = async (req, res) => {
  console.log("Fetching comments for post:", req.params.postId);
  const postId = req.params.postId;

  try {
    // Find all comments for the given postId
    const comments = await CommentModel.find({ postId });

    if (comments) {
      console.log("Comments:", comments);

      // Extract content from each comment
      

      res.status(200).json({ comments });
    } else {
      console.log("No comments found for the post.");
      res.status(404).json({ message: "No comments found for the post." });
    }
  } catch (error) {
    console.log("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments." });
  }
};
