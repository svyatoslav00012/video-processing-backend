import type {PgDB} from "../db/postgres/client.ts";
import {Config} from "../config.ts";
import * as jwt from "jsonwebtoken";
import {users} from "../../pg/schema.ts";
import type {User} from "../../pg/schema.ts";
import {eq} from "drizzle-orm";
import {psqlDB} from "../db/postgres/client.ts";
import {jwtSign, jwtVerify} from "./jwtTools.ts";

type JwtToken = string;

export interface AuthService {
    signin: (email: string, password: string) => Promise<{token: JwtToken, userId: number}>;
    signup: (email: string, password: string) => Promise<void>;
}

export class WrongCredentialsError extends Error {}
export class UnauthorizedError extends Error {}
export class UserAlreadyExistsError extends Error {}
export class JwtValidationError extends Error {}

export class AuthServiceImpl implements AuthService {
    private readonly db: PgDB

    constructor(db: PgDB) {
        this.db = db;
    }

    async verify(token: string): Promise<number> {
        const decoded = await jwtVerify<{ userId: number }>(token)
            .catch((err) => {
                throw new JwtValidationError(err)
            });
        const user = await this.db.query.users.findFirst({with: {userId: decoded.userId}});
        if (!user) {
            throw new UnauthorizedError("User not found");
        }
        return user.id;
    }

    async signin(email: string, plainPassword: string): Promise<{token: JwtToken, userId: number}> {
        const result = await this.db.select().from(users).where(eq(users.email, email))
        if (!result || result.length === 0) {
            throw new WrongCredentialsError("User not found");
        }
        const user: User = result[0]
        if (!await Bun.password.verify(plainPassword, user.password)) {
            throw new WrongCredentialsError("Invalid password");
        }
        return {
            token: await jwtSign({userId: user.id}),
            userId: user.id as number,
        };
    }

    async signup(email: string, password: string): Promise<void> {
        const passwordHash = await Bun.password.hash(password);
        try {
            await this.db.insert(users).values({email, password: passwordHash})
        } catch (e) {
            console.log(typeof e)
            throw new UserAlreadyExistsError("User already exists");
        }
    }
}

export const authService = new AuthServiceImpl(psqlDB);
