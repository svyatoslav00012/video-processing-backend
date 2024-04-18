import express from "express";
import multer from "multer";
const fileUpload = require('express-fileupload');


export const filesRouter = express.Router();

filesRouter.use(fileUpload())

// const upload = multer({ dest: 'uploads/', limits: {fileSize: 1000*1000*1000} })
// filesRouter.post('/upload', upload.single('file'), (req, res) => {
//     console.log(req.body)
//     console.log('file', req.file)
//     // console.log(req)
//     res.status(200).send({filename: req.file?.filename})
// })

filesRouter.post('/upload', (req, res) => {
    console.log(req.files)
    // console.log('file', req.file)
    // console.log(req)
    res.status(200).send({filename: req.files?.sampleFile?.name})
})

filesRouter.get('/:id', (req, res) => {

})
