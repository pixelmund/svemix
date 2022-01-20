import type { RequestHandler } from '@sveltejs/kit/types/endpoint';
import type { RequestEvent } from '@sveltejs/kit/types/hooks';
import type { ActionResult, LoaderResult } from '.';
import type { MetaFunction } from '../meta';
interface SvemixPostHandlerParams {
	action: (event: RequestEvent) => Promise<ActionResult> | ActionResult;
}
interface SvemixGetHandlerParams {
	loader: (event: RequestEvent) => Promise<LoaderResult> | LoaderResult;
	hasMeta: boolean;
	metadata: MetaFunction<any>;
}
export declare function getHandler({
	hasMeta,
	loader,
	metadata
}: SvemixGetHandlerParams): RequestHandler<any, any>;
export declare function postHandler({ action }: SvemixPostHandlerParams): RequestHandler<any, any>;
export {};
