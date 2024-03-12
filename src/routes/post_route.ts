import express from "express";
const router = express.Router();
import postController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";

/**
* @swagger
* tags:
*   name: Post
*   description: The Post handler api
*/

/**
* @swagger
* components:
*   schemas:
*     NewPost:
*       type: object
*       required:
*         - content
*         - imgUrl
*       properties:
*         content:
*           type: string
*           description: The post content
*         imgUrl:
*           type: string
*           description: The post image url
*       example:
*         content: 'some content'
*         imgUrl: 'https://fakePath/fake.png'
*/

/**
* @swagger
* /post/create:
*   post:
*     summary: Creates new post
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/NewPost'
*     responses:
*       200:
*         description: The new post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/NewPost'
*/
router.post("/create", authMiddleware, postController.createPost);
/**
* @swagger
* components:
*   schemas:
*     UpdatePost:
*       type: object
*       required:
*         - content
*         - imgUrl
*         - postId
*       properties:
*         content:
*           type: string
*           description: The post content
*         imgUrl:
*           type: string
*           description: The post image url
*         postId:
*           type: string
*           description: The post Id
*       example:
*         content: 'some content'
*         imgUrl: 'https://fakePath/fake.png'
*         postId: 1234567abc
*/

/**
* @swagger
* /post/update:
*   put:
*     summary: Update post
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/UpdatePost'
*     responses:
*       200:
*         description: The updated post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/UpdatePost'
*       403:
*         description: The user doesn't have permissions to do it.
*/
router.put("/update", authMiddleware, postController.updatePost);
/**
* @swagger
* /post/myPosts:
*   get:
*     summary: Get all my posts
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: The updated post
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/NewPost'
*/
router.get("/myPosts", authMiddleware, postController.getMyPosts);
/**
* @swagger
* components:
*   schemas:
*     PostID:
*       type: object
*       required:
*         - postId
*       properties:
*         postId:
*           type: string
*           description: The post Id
*       example:
*         postId: 1234567abc
*/

/**
* @swagger
* /post/like:
*   put:
*     summary: Like a post
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/PostID'
*     responses:
*       200:
*         description: The liked post
*         content:
*           application/json:
*             schema:
*               type: string
*/
router.put("/like", authMiddleware, postController.likePost);
/**
* @swagger
* components:
*   schemas:
*     PostComment:
*       type: object
*       required:
*         - postId
*         - comment
*         - user
*       properties:
*         postId:
*           type: string
*           description: The post Id
*         comment:
*           type: string
*           description: The comment string
*         user:
*           type: string
*           description: The user string
*       example:
*         postId: 1234567abc
*         comment: nice post
*         user: some_user
*/

/**
* @swagger
* /post/comment:
*   put:
*     summary: Comment on a post
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/PostComment'
*     responses:
*       200:
*         description: The commented post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/NewPost'
*/
router.put("/comment", authMiddleware, postController.commentOnPost);
/**
* @swagger
* /post/delete:
*   delete:
*     summary: Delete a post
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/PostID'
*     responses:
*       200:
*         description: The deleted post
*         content:
*           application/json:
*             schema:
*               type: string
*/
router.delete("/delete", authMiddleware, postController.deletePost);
/**
* @swagger
* /post/fetch:
*   get:
*     summary: Fetch all posts
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: All the posts
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/UpdatePost'
*/
router.get("/fetch", authMiddleware, postController.getAllPosts);
/**
* @swagger
* components:
*   schemas:
*     PostById:
*       type: object
*       required:
*         - postId
*       post:
*         postId:
*           type: string
*           description: The post id
*       example:
*         postId: 1234567abc
*/
/**
* @swagger
* /post/byId:
*   get:
*     summary: Get post by id
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: query
*         name: postId
*         schema:
*           type: string
*         required: true
*         description: The post id
*     responses:
*       200:
*         description: The new post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/PostById'
*/
router.get("/byId", authMiddleware, postController.getPostById);

export default router;