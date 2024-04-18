import * as jwt from "jsonwebtoken";
import {Config} from "../config.ts";

export const jwtSign = <T extends object>(payload: T): Promise<string> => {
    return new Promise((res, rej) =>
        jwt.sign(
            payload,
            Config.server.JWT_SECRET,
            {
                expiresIn: Config.server.JWT_EXPIRES_IN,
            },
            (err, token) => {
                if (err || !token) {
                    rej(err);
                } else {
                    res(token);
                }
            }
        )
    );
}

export const jwtVerify = <T>(token: string): Promise<T>  => {
    return new Promise((res, rej) =>
        jwt.verify(token, Config.server.JWT_SECRET, (err, decoded) => {
            if (err) {
                rej(err);
            } else {
                res(decoded as T);
            }
        })
    )
}
