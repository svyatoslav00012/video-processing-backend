import type {NextFunction, Request, Response} from "express";
import {
    authService,
    JwtValidationError,
    UnauthorizedError,
    UserAlreadyExistsError,
    WrongCredentialsError
} from "./auth/service.ts";
import asyncHandler from "express-async-handler";

declare module 'express-serve-static-core' {
    interface Request {
        userId: number
    }
}

export const globalErrorHandler = <E extends Error>(err: E, req: Request, res: Response, next: NextFunction) => {
    // app.use((err, req, res, next) => {
    console.error('error handled')
    console.error(err.stack)
    if(err instanceof WrongCredentialsError)
        res.status(401).send('Wrong credentials')
    else if(err instanceof UnauthorizedError)
        res.status(401).send('Unauthorized')
    else if(err instanceof UserAlreadyExistsError)
        res.status(409).send('User already exists')
    else res.status(500).send('Something broke!')
    // next(err)
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).send("Sorry can't find that!")
    next()
}

export const AUTH_TOKEN_COOKIE_NAME = 'authToken'



export const authMiddleware = asyncHandler(async (req: Request, res: Response, next) => {
    try {
        const userId = await authService.verify(req.cookies[AUTH_TOKEN_COOKIE_NAME])
        req.userId = userId
    } catch (e) {
        if (e instanceof JwtValidationError || e instanceof UnauthorizedError){
            res.status(401).send('Unauthorized')
        }
    }
    next()
})
