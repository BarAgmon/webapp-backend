import express from "express";
const router = express.Router();
import userController from "../controllers/user_controller";
import authMiddleware from "../common/auth_middleware";

/**
* @swagger
* tags:
*   name: User
*   description: The User handler api
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
* /user:
*    delete:
*      summary: Deletes the authenticated user's account
*      tags:
*        - User
*      security:
*        - bearerAuth: []
*      responses:
*        200:
*          description: User account deleted successfully
*        401:
*          description: Unauthorized - Token is invalid or not provided
*        500:
*          description: Internal server error
*/
router.delete("/", authMiddleware, userController.deleteById.bind(userController));

/**
* @swagger
* /user:
*    post:
*      summary: Updates the authenticated user's account details
*      tags:
*        - User
*      security:
*        - bearerAuth: []
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/User'
*      responses:
*        200:
*          description: User account updated successfully
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/User'
*        404:
*          description: User not found
*        406:
*          description: Validation failed or update failed
*        500:
*          description: Internal server error
*/
router.post("/", authMiddleware, userController.updateById.bind(userController));

export default router;