import express from "express";
import multer from "multer";
import {extractUserIdFromFileServerName, storageLocation} from "./fileServer.ts";
import {authMiddleware} from "../middleware.ts";
import asyncHandler from "express-async-handler";
import { unlink } from "node:fs/promises";

export const filesRouter = express.Router();

export const GB = 1024 * 1024 * 1024

// Deprecated. Not working with bun. Using native bun file server instead.
const upload = multer({ dest: 'uploads/', limits: {fileSize: GB} })
filesRouter.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
    console.log(req.body)
    console.log('file', req.file)
    // console.log(req)
    res.status(200).send({filename: req.file?.filename})
})

filesRouter.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
    console.log('returning file', req.params.id)
    const fileOwnerId = extractUserIdFromFileServerName(req.params.id)
    const serverPath = storageLocation(req.params.id)
    const fileExists = await Bun.file(serverPath).exists()

    if(fileOwnerId !== req.userId) {
        res.status(403).send('Forbidden')
    }
    else if(!fileExists) {
        res.status(404).send('Not found')
    }
    else {
        res.download(serverPath)
    }
}))

filesRouter.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
    console.log('deleting file', req.params.id)
    const fileOwnerId = extractUserIdFromFileServerName(req.params.id)
    const serverPath = storageLocation(req.params.id)
    const fileExists = await Bun.file(serverPath).exists()

    if(fileOwnerId !== req.userId) {
        res.status(403).send('Forbidden')
    }
    else if(!fileExists) {
        res.status(404).send('Not found')
    }
    else {
        await unlink(serverPath)
        res.status(200).send()
    }
}))
