import type { Session, SessionOptions } from './types';
export default function CookieSession<SessionType = Record<string, any>>(
	headers: Record<string, any>,
	userOptions: SessionOptions
): Session<SessionType>;
