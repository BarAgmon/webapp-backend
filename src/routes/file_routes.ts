import express from "express";
const router = express.Router();
import multer from "multer";

const base = process.env.SERVER_URL + "/";

// Create a storage engine to store files on local filesystem.
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const error = null
        callback(error, 'public/')
    },
    filename: function (req, file, callback) {
        const error = null
        const ext = file.originalname.split('.')
            .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
            .slice(1)
            .join('.')
            callback(error, Date.now() + "." + ext)
    }
})
const upload = multer({ storage: storage });

/**
* @swagger
* tags:
*   name: File
*   description: The file handler api
*/

/**
* @swagger
* /file:
*   post:
*     summary: Upload a file
*     tags: 
*       - File
*     requestBody:
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               file:
*                 type: string
*                 format: binary
*                 description: The file to upload
*     responses:
*       200:
*         description: File uploaded successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 url:
*                   type: string
*                   description: URL of the uploaded file
* 
*/

router.post('/', upload.single("file"), function (req, res) {
    console.log("router.post(/file: " + base + req.file.path)
    res.status(200).send({ url: base + req.file.path })
});
export = router;