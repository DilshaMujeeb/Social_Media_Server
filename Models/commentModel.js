import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    postId: {
        type:String
    },
    userId: {
        type:String
    },
    content: {
        type:String
    }
})

const CommentModel = mongoose.model("comment", CommentSchema)

export default CommentModel
