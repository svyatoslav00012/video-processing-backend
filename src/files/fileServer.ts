import {GB} from "./controller.ts";
import {AUTH_TOKEN_COOKIE_NAME} from "../middleware.ts";
import {authService, UnauthorizedError} from "../auth/service.ts";

export const runFileServer = () => Bun.serve({
    hostname: '127.0.0.1',
    port: 4000,
    maxRequestBodySize: GB,
    async fetch(req) {
        const url = new URL(req.url);
        let userId = -1
        try {
            userId = await verifyUser(req);
        } catch (e) {
            console.error('verification failed when uploading file')
            console.error(e)
            if(e instanceof UnauthorizedError)
                return new Response("Unauthorized", { status: 401 });
            return new Response("Internal Server Error", { status: 500 });
        }


        if (url.pathname === '/api/v1/file/upload' && req.method === 'POST'){
            console.log('receving file...')
            const formdata = await req.formData();
            const file = formdata.get('file');
            if(!file || !(file instanceof File))
                return new Response("No file found", { status: 400 });

            const serverFileName = buildFileServerName(file.name, userId);
            await Bun.write(storageLocation(serverFileName), file);
            return new Response(serverFileName);
        }

        return new Response("Not Found", { status: 404 });
    },
});

export const extractUserIdFromFileServerName = (filename: string): number | undefined => {
    const parts = filename.split('.');
    if(parts.length < 2)
        return undefined
    const name = parts[parts.length - 2];
    const idStr = name.split('_').pop();
    return idStr ? parseInt(idStr) : undefined;
}

export const buildFileServerName = (filename: string, userId: number): string =>
    addFileNamePostfix(filename, `_${crypto.randomUUID()}_${userId}`);

const addFileNamePostfix = (filename: string, postfix: string): string => {
    const extension = filename.split('.').pop();
    return filename.replace(`.${extension}`, `${postfix}.${extension}`);
}



export const storageLocation = (filename: string): string => `../uploads/${filename}`

type UserId = number
const verifyUser = async (req: Request): Promise<UserId> => {
    const authToken = getAuthTokenCookie(req);
    if(!authToken)
        return Promise.reject(new UnauthorizedError("No token provided"))
    return authService.verify(authToken);
}

const getAuthTokenCookie = (req: Request): string | undefined => {
    const unparsedCookies = req.headers.get('cookie');
    if(!unparsedCookies)
        return undefined
    const cookies = parseCookies(unparsedCookies);
    return cookies[AUTH_TOKEN_COOKIE_NAME]
}

const parseCookies = (cookieString: string): Record<string, string> => {
    const cookies: Record<string, string> = {};
    if (cookieString) {
        const list = cookieString.split(';');
        list.forEach(cookie => {
            const parts = cookie.split('=');
            cookies[decodeURIComponent(parts[0].trim())] = decodeURIComponent(parts[1].trim());
        });
    }
    return cookies;
}
