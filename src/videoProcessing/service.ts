import type {SubmittedVideo, SubmitVideoDTO} from "../types/types.ts";
import {Video} from "../db/mongo/schema.ts";

class NotFoundError extends Error {}

interface VideoProcessingService {
    processVideo: (userId: number, submitVideoDTO: SubmitVideoDTO) => Promise<void>;
    getVideoById: (userId: number, videoId: string) => Promise<SubmittedVideo>;
    getVideos: (userId: number) => Promise<SubmittedVideo[]>
}

export class VideoProcessingServiceImpl implements VideoProcessingService {
    async processVideo(userId: number, submitVideoDTO: SubmitVideoDTO): Promise<void> {
        await new Video({
            ...submitVideoDTO,
            userId,
        }).save()
    }

    async getVideoById(userId: number, videoId: string): Promise<SubmittedVideo> {
        const video = await Video.findById(videoId)
        if(!video || video.userId !== userId) {
            throw new NotFoundError("Video not found")
        }
        return video
    }

    async getVideos(userId: number): Promise<SubmittedVideo[]> {
        return await Video.find({userId})
    }
}
