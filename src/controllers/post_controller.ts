import { Request, Response } from 'express';
import Post, {IComment} from '../models/post_model';
import User from '../models/user_model';

class PostError extends Error {
    code: string;

    constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, PostError.prototype);
    }
}

const createPost = async (req: Request, res: Response) => {
    const user = req["user"];
    let { imgUrl, content } = req.body;
    if (!imgUrl || !content) {
        return res.status(400).send("missing fileds");
    }
    try {
    const newPost = await Post.create(
        {
            'content': content,
            'createdAt': new Date(),
            'user': user,
            'imgUrl': imgUrl
        });
    res.status(201).send(
        {
            content: newPost.content,
            _id: newPost._id,
            imgUrl: newPost.imgUrl,
        })
    } catch (error) {
        return res.status(500).json("Internal server error: " + error);
    }
}

const checkPostExists = async (post, postId) => {
    if (!post) {
        throw new Error("The post " + postId + " does not exist");
    }
};

const checkEditPermissions = async (post, userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("The user " + userId + " does not exists");
    }

    if (post.user.toString() === userId) {
        return;
    }

    const errorMessage = "The user does not have permissions";
    const errorCode = "403";
    throw new PostError(errorMessage, errorCode);
};

const updatePost = async (req, res) => {
    try {
        const user = req["user"];
        let { postId, imgUrl, content } = req.body;
        let post = await Post.findById(postId);
        await checkPostExists(post, postId);
        await checkEditPermissions(post, user["_id"]);

        if (!content) {
            content = post.content;
        }

        if (!imgUrl) {
            imgUrl = post.imgUrl;
        }

        let newPost = {
            content: content,
            imgUrl: imgUrl,
        };

        post = await Post.findByIdAndUpdate({ _id: postId }, newPost);
        res.status(200).json(post);
    } catch (error) {
        if (error.code === "403") {
            return res.status(403).json(error.message);
        }

        return res.status(500).json("Internal server error: " + error);
    }
};

const getMyPosts = async (req, res) => {
    try {
        const user = req["user"];
        const posts = await Post.find({ user: user["_id"] });
        if (!posts) {
            return res.status(200).json("You don't have any posts");
        }

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json("Internal server error: " + error);
    }
};

const likePost = async (req, res) => {
    try {
    const user = req["user"];
    const { postId } = req.body;
    const post = await Post.findById(postId);
    await checkPostExists(post, postId);
    const userId = user["_id"]
    if (!post.like.includes(userId)) {
        if (post.dislike.includes(userId)) {
        await post.updateOne({ $pull: { dislike: userId } });
        }
        await post.updateOne({ $push: { like: userId } });
        return res.status(200).json("Post has been liked");
    } else {
        await post.updateOne({ $pull: { like: userId } });
        return res.status(200).json("Post has been unlike");
    }

    } catch (error) {
        return res.status(500).json("Internal server error: " + error);
    }
};

const dislikePost = async (req, res) => {
    try {
    const user = req["user"];
    const { postId } = req.body;
    const post = await Post.findById(postId);
    await checkPostExists(post, postId);
    const userId = user["_id"]
    if (!post.dislike.includes(userId)) {
        if (post.like.includes(userId)) {
            await post.updateOne({ $pull: { like: userId } });
        }
        await post.updateOne({ $push: { dislike: userId } });
        return res.status(200).json("Post has been disliked");
    } else {
        await post.updateOne({ $pull: { dislike: userId } });
        return res.status(200).json("Post has been undislike");
    }

    } catch (error) {
        return res.status(500).json("Internal server error: " + error);
    }
};

const commentOnPost = async (req, res) => {
    try {
        const user = req["user"];
        const { postId, comment } = req.body;
        const commentObj: IComment = { user, comment };
        const post = await Post.findById(postId);
        await checkPostExists(post, postId);
        post.comments.push(commentObj);
        await post.save();
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json("Internal server error: " + error);
    }
};

const deletePost = async (req, res) => {
    try {
        const user = req["user"];
        const { postId } = req.body;
        const post = await Post.findById(postId);
        await checkPostExists(post, postId);
        await checkEditPermissions(post, user["_id"]);
        await Post.findByIdAndDelete(postId);
        return res.status(200).json("Your post has been deleted");
    } catch (error) {
        if (error.code === "403") {
            return res.status(403).json(error.message);
        }
        return res.status(500).json("Internal server error: " + error);
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        return res.status(200).send(posts);
    } catch (error) {
        return res.status(500).json("Internal server error: " + error);
    }
};

export default {
    createPost,
    updatePost,
    getMyPosts,
    likePost,
    dislikePost,
    commentOnPost,
    deletePost,
    getAllPosts
}