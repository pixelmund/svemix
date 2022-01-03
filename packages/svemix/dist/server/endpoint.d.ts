import type { RequestHandler } from '@sveltejs/kit/types/endpoint';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';
import type { ActionResult, LoaderResult, MetaFunction } from '.';
interface SvemixPostHandlerParams {
    action: (request: ServerRequest) => Promise<ActionResult> | ActionResult;
}
interface SvemixGetHandlerParams {
    loader: (request: ServerRequest) => Promise<LoaderResult> | LoaderResult;
    hasMeta: boolean;
    metadata: MetaFunction<any>;
}
export declare function getHandler({ hasMeta, loader, metadata }: SvemixGetHandlerParams): RequestHandler<any, any, any>;
export declare function postHandler({ action }: SvemixPostHandlerParams): RequestHandler<any, any, any>;
export {};
