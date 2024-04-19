import {authRouter} from "../auth/controller.ts";
import {Config} from "../config.ts";
import type {Express} from "express";
import express from "express";
import bodyParser from "body-parser";
import {globalErrorHandler, notFoundHandler} from "../middleware.ts";
import cookieParser from "cookie-parser";
import {videoProcessingRouter} from "../videoProcessing/controller.ts";
import {filesRouter, GB} from "../files/controller.ts";
import cors from "cors";



export const runServer = async (): Promise<Express> => {
    const app = express()
    const rootRouter = express.Router()

    app.use(express.json()) // for parsing application/json
    app.use(express.urlencoded({ extended: true }))
    // app.use(bodyParser.json({limit: GB})) // for parsing application/json
    // app.use(bodyParser.urlencoded({ extended: true, limit: GB }))
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

    app.listen(Config.server.PORT, '127.0.0.1', () => {
        console.log(`Example app listening on port ${Config.server.PORT}!`)
    })

    return app
}
