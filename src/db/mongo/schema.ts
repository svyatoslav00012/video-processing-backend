import { Schema, model, connect } from 'mongoose';
import type {SubmittedVideo} from "../../types/types.ts";
import * as mongoose from "mongoose";
import {Config} from "../../config.ts";


mongoose.set('toJSON', {
    virtuals: true,
    transform: (doc, converted) => {
        delete converted._id;
    }
});
// 2. Create a Schema corresponding to the document interface.
const videoSchema = new Schema<SubmittedVideo>({
    // id: String,
    userId: {type: Number, index: true},
    videoFile: {
        name: String,
        // url: String
        serverFileName: String
    },
    micAudioFile: {
        name: String,
        // url: String
        serverFileName: String
    },
    previewSdUrl: String,
    previewHdUrl: String,
    metadata: {
        originalDuration: Number,
        finalDuration: Number,
        width: Number,
        height: Number,
        rotation: Number
    },
    options: {
        marginBefore: Number,
        marginAfter: Number,
        dbUp: Number
    },
    tasks: [String],
    status: String,
    error: String,
    queuePosition: Number,
    processingStatus: {
        progress: Number,
        currentStatus: String,
        steps: [{
            step: String,
            status: String
        }]
    },
    outputFile: {
        name: String,
        // url: String,
        serverFileName: String
    }
});

// 3. Create a Model.
export const Video = model<SubmittedVideo>('video', videoSchema);

await connect(`mongodb://${Config.mongo.HOST}:${Config.mongo.PORT}/${Config.mongo.DB_NAME}`)
    .then(() => console.log('Connected to MongoDB'));
