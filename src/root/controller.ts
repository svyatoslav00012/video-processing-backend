import {authRouter} from "../auth/controller.ts";
import {Config} from "../config.ts";
import type {Express} from "express";
import express from "express";
import bodyParser from "body-parser";
import {globalErrorHandler, notFoundHandler} from "../middleware.ts";
import cookieParser from "cookie-parser";
import {videoProcessingRouter} from "../videoProcessing/controller.ts";
import {filesRouter} from "../files/controller.ts";
import cors from "cors";

export const runServer = async (): Promise<Express> => {
    const app = express()
    const rootRouter = express.Router()

    app.use(express.json({limit: '1000mb'})) // for parsing application/json
    app.use(express.urlencoded({ extended: true, limit: '1000mb' }))
    app.use(cors())

    app.use(cookieParser())

    rootRouter.use('/auth', authRouter)
    rootRouter.use('/videos', videoProcessingRouter)
    rootRouter.use('/file', filesRouter)

    app.use('/api/v1', rootRouter)

    //custom error handling
    app.use(globalErrorHandler)
    // custom 404
    app.use(notFoundHandler)

    app.listen(Config.server.PORT, () => {
        console.log(`Example app listening on port ${Config.server.PORT}!`)
    })



    return app
}
