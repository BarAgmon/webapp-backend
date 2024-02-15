import express from "express";
const router = express.Router();
import authController from "../controllers/auth_controller";

/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - email
*         - password
*         - imgUrl
*       properties:
*         email:
*           type: string
*           description: The user email
*         password:
*           type: string
*           description: The user password
*         imgeUrl:
*           type: string
*           description: The url of the profile image
*       example:
*         email: 'bob@gmail.com'
*         password: '123456'
*         imgUrl: 'https://fakePath/fake.png'
*/

/**
* @swagger
* /auth/register:
*   post:
*     summary: registers a new user
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The new user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/
router.post("/register", authController.register);

/**
* @swagger
* components:
*   schemas:
*     Tokens:
*       type: object
*       required:
*         - accessToken
*         - refreshToken
*       properties:
*         accessToken:
*           type: string
*           description: The JWT access token
*         refreshToken:
*           type: string
*           description: The JWT refresh token
*       example:
*         accessToken: '123cd123x1xx1'
*         refreshToken: '134r2134cr1x3c'
*/

/**
* @swagger
* /auth/login:
*   post:
*     summary: login with an email and password
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The access & refresh tokens
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Tokens'
*/
router.post("/login", authController.login);

/**
* @swagger
* /auth/logout:
*   get:
*     summary: logout a user
*     tags: [Auth]
*     description: need to provide the refresh token in the auth header
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: logout completed successfully
*/
router.post("/logout", authController.logout);


/**
* @swagger
* /auth/refresh:
*   get:
*     summary: Refreshes the authentication tokens
*     description: Provide refresh token on Authorize section.
*     tags: [Auth]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Successfully refreshed the access and refresh tokens.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Tokens'
*       401:
*         description: Unauthorized. Token is invalid or not provided.
*/

router.get("/refresh", authController.refresh);

/**
* @swagger
* /auth/google:
*   post:
*     summary: Sign in using Google
*     description: Signs in the user by verifying the Google ID token provided in the request body.
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               credential:
*                 type: string
*                 description: Google ID token.
*     responses:
*       200:
*         description: Successfully signed in with Google. Returns user info along with access and refresh tokens.
*         content:
*           application/json:
*             schema:
*               allOf:
*                 - $ref: '#/components/schemas/User'
*                 - type: object
*                   properties:
*                     accessToken:
*                       type: string
*                       description: JWT access token for authorization.
*                     refreshToken:
*                       type: string
*                       description: JWT refresh token for getting new access tokens.
*       400:
*         description: Bad request. Possible issues with the provided ID token.
*       401:
*         description: Unauthorized. Token is invalid or not provided.
*/
router.post("/google", authController.googleSignin);
export default router;