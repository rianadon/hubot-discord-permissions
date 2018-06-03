/**
 * From https://github.com/mattvperry/typed-scoped-http-client
 */
declare module "scoped-http-client" {
    import { Agent, RequestOptions, IncomingMessage, ClientRequest } from "http";

    type ScopeCallback = (scoped: ScopedClient) => void;
    type RequestCallback = (err: any, request: ClientRequest) => void;
    type ResponseCallback = (cb?: (err: any, response: IncomingMessage, body: string) => void) => ScopedClient;

    interface Options extends RequestOptions {
        encoding?: string;
        httpAgent?: Agent|boolean;
        httpsAgent?: Agent|boolean;
        query?: any;
        pathname?: string;
        slashes?: any;
        hash?: string;
    }

    class ScopedClient {
        constructor(url: string, options: Options);
        fullPath(p: string): string;
        scope(options: Options, callback?: ScopeCallback): ScopedClient;
        scope(url: string, callback?: ScopeCallback): ScopedClient;
        scope(url: string, options: Options, callback?: ScopeCallback): ScopedClient;
        join(suffix: string): string;
        path(p: string): ScopedClient;
        query(key: any, value?: any): ScopedClient;
        host(h: string): ScopedClient;
        port(p: string|number): ScopedClient;
        protocol(p: string): ScopedClient;
        encoding(e?: string): ScopedClient;
        timeout(time: any): ScopedClient;
        auth(user?: string, pass?: string): ScopedClient;
        header(name: string, value: string): ScopedClient;
        headers(h: any): ScopedClient;

        request(method: string): ResponseCallback;
        request(method: string, callback: RequestCallback): ResponseCallback;
        request(method: string, reqBody: string, callback: RequestCallback): ResponseCallback;

        get(): ResponseCallback;
        get(callback: RequestCallback): ResponseCallback;
        get(reqBody: string, callback: RequestCallback): ResponseCallback;

        post(): ResponseCallback;
        post(callback: RequestCallback): ResponseCallback;
        post(reqBody: string, callback: RequestCallback): ResponseCallback;

        patch(): ResponseCallback;
        patch(callback: RequestCallback): ResponseCallback;
        patch(reqBody: string, callback: RequestCallback): ResponseCallback;

        put(): ResponseCallback;
        put(callback: RequestCallback): ResponseCallback;
        put(reqBody: string, callback: RequestCallback): ResponseCallback;

        delete(): ResponseCallback;
        delete(callback: RequestCallback): ResponseCallback;
        delete(reqBody: string, callback: RequestCallback): ResponseCallback;

        del(): ResponseCallback;
        del(callback: RequestCallback): ResponseCallback;
        del(reqBody: string, callback: RequestCallback): ResponseCallback;

        head(): ResponseCallback;
        head(callback: RequestCallback): ResponseCallback;
        head(reqBody: string, callback: RequestCallback): ResponseCallback;

    }

    export function create(options: Options): ScopedClient;
    export function create(url?: string, options?: Options): ScopedClient;
}
