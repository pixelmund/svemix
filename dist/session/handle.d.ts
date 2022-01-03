import type { Handle } from '@sveltejs/kit';
import type { Session, SessionOptions } from './types';
export declare function handleSession<
	Locals extends {
		session: Session;
	}
>(options: SessionOptions, passedHandle?: Handle<Locals>): Handle<Locals, unknown>;
