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

router.post('/', upload.single("file"), function (req, res) {
    console.log("router.post(/file: " + base + req.file.path)
    res.status(200).send({ url: base + req.file.path })
});
export = router;