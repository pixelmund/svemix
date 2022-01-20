import type { Session, SessionOptions } from './types';
export default function CookieSession<SessionType = Record<string, any>>(
	headers: Headers,
	userOptions: SessionOptions
): Session<SessionType>;
