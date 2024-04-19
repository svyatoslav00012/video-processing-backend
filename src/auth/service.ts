import type {PgDB} from "../db/postgres/client.ts";
import {psqlDB} from "../db/postgres/client.ts";
import type {User} from "../db/postgres/schema.ts";
import {users} from "../db/postgres/schema.ts";
import {eq} from "drizzle-orm";
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
        // const user = await this.db.query.users.findFirst({with: {userId: decoded.userId}});
        const result = await this.db.select().from(users).where(eq(users.id, decoded.userId));
        if (!result || result.length === 0) {
            throw new UnauthorizedError("User not found");
        }
        return decoded.userId;
    }

    async signin(email: string, plainPassword: string): Promise<{token: JwtToken, userId: number}> {
        const result = await this.db.select().from(users).where(eq(users.email, email))
        if (!result || result.length === 0) {
            throw new WrongCredentialsError("User not found");
        }
        const user: User = result[0]
        if (!await comparePassword(plainPassword, user.password)) {
            throw new WrongCredentialsError("Invalid password");
        }
        return {
            token: await jwtSign({userId: user.id}),
            userId: user.id as number,
        };
    }

    async signup(email: string, password: string): Promise<void> {
        const passwordHash = await hashPassword(password);
        try {
            await this.db.insert(users).values({email, password: passwordHash})
        } catch (e) {
            console.log(typeof e)
            throw new UserAlreadyExistsError("User already exists");
        }
    }
}

const hashPassword = async (password: string): Promise<string> => {
    return Bun.password.hash(password);
    // return bcrypt.hash(password, 10);
}

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return Bun.password.verify(password, hash);
    // return bcrypt.compare(password, hash);
}

export const authService = new AuthServiceImpl(psqlDB);
