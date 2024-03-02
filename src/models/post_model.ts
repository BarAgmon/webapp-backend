import mongoose from "mongoose";

export interface IComment {
  user: string;
  comment: string;
}

export interface IPost {
  user: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  content: string;
  imgUrl?: string;
  _id?: string;
  like: string[];
  dislike: string[];
  comments: IComment[];
}

const postSchema = new mongoose.Schema<IPost>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  createdAt: {
    type: Date,
  },
  content: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
  },
  like: {
    type: [String],
  },
  dislike: {
    type: [String],
  },
  comments: [
    {
      user: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

export default mongoose.model<IPost>("Post", postSchema);