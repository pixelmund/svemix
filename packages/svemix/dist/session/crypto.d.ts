/**
 *
 *  This work is mostly copied over from `string-cipher` => `https://github.com/limplash/string-cipher`, but since it doesn't support esm(yet) i decided to copy
 *  only the bits needed for `svelte-kit-cookie-session`. Thank you limplash!
 *  MIT License
 *  Copyright (c) 2021 limplash
 *
 */
import type { BinaryLike } from './types';
export declare function encrypt(encryptionKey: BinaryLike): (text: string) => string;
export declare function decrypt(encryptionKey: BinaryLike): (encrypted_string: string) => string;
