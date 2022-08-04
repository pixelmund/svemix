import type { CookieSerializeOptions } from "$lib/cookie";
import type { BinaryLike as CBinaryLike } from "crypto";
import type { GetSession } from "@sveltejs/kit";

export interface SessionOptions {
  key?: string;
  secret: CBinaryLike | { id: number; secret: CBinaryLike }[];
  expires?: number;
  rolling?: true | number;
  cookie?: Omit<CookieSerializeOptions, "expires" | "maxAge" | "encode">;
  getSession?: GetSession
}

export interface Session<SessionType = Record<string, any>> {
  shouldSync: boolean;
  data: SessionType & {
    expires?: Date;
  }
  update: (updateFn: (data: SessionType) => Partial<SessionType> | Promise<Partial<SessionType>>) => Promise<SessionType>;
  set: (data?: SessionType) => Promise<SessionType>;
  refresh: (expires_in_days?: number) => Promise<boolean>;
  destroy: () => Promise<boolean>;
}

export interface PrivateSession {
  "set-cookie"?: string | undefined;
}

export type BinaryLike = CBinaryLike;
