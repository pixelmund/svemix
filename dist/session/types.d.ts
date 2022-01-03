/// <reference types="node" />
import type { CookieSerializeOptions } from './cookie';
import type { BinaryLike as CBinaryLike } from 'crypto';
export interface SessionOptions {
	key?: string;
	secret:
		| CBinaryLike
		| {
				id: number;
				secret: CBinaryLike;
		  }[];
	expires?: number;
	rolling?: boolean;
	cookie?: Omit<CookieSerializeOptions, 'expires' | 'maxAge' | 'encode'>;
}
export interface Session<SessionType = Record<string, any>> {
	shouldSendToClient?: boolean;
	data: SessionType & {
		expires?: Date;
	};
	refresh: (expires_in_days?: number) => boolean;
	destroy: () => boolean;
}
export interface PrivateSession {
	'set-cookie'?: string | undefined;
}
export declare type BinaryLike = CBinaryLike;
