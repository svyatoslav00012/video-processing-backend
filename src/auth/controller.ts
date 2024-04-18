import express from "express";
import {psqlDB} from "../db/postgres/client.ts";
import {authService, AuthServiceImpl} from "./service.ts";
import asyncHandler from "express-async-handler";
import {AUTH_TOKEN_COOKIE_NAME} from "../middleware.ts";

export const authRouter = express.Router();

authRouter.post('/signup', asyncHandler(async (req, res) => {
    await authService.signup(req.body.email, req.body.password)
    res.status(201).send()
}))

authRouter.post('/signin', asyncHandler(async (req, res) => {
    const {token, userId} = await authService.signin(req.body.email, req.body.password)
    res.cookie(AUTH_TOKEN_COOKIE_NAME, token)
        .status(200)
        .send({userId})
}))
