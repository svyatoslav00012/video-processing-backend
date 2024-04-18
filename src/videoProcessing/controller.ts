import express from "express";
import asyncHandler from "express-async-handler";
import {VideoProcessingServiceImpl} from "./service.ts";
import {authMiddleware} from "../middleware.ts";

export const videoProcessingRouter = express.Router();

const videoProcessingService = new VideoProcessingServiceImpl();

videoProcessingRouter.post('/process', authMiddleware, asyncHandler(async (req, res) => {
    await videoProcessingService.processVideo(req.userId, req.body)
    res.status(200).send()
}))

videoProcessingRouter.get('/', authMiddleware, asyncHandler(async (req, res) => {
    res.status(200).send(await videoProcessingService.getVideos(req.userId))
}))

videoProcessingRouter.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
    res.status(200).send(await videoProcessingService.getVideoById(req.userId, req.params.id))
}))
