/**
 *
 *  This work is mostly copied over from `string-cipher` => `https://github.com/limplash/string-cipher`, but since it doesn't support esm(yet) i decided to copy
 *  only the bits needed for `svelte-kit-cookie-session`. Thank you limplash!
 *  MIT License
 *  Copyright (c) 2021 limplash
 *
 */
import { pbkdf2Sync, createDecipheriv, createCipheriv, randomBytes } from 'crypto';
const keyLengthHint = (algo) => {
    switch (algo) {
        case 'aes-256-gcm':
            return 32;
        case 'aes-192-gcm':
            return 24;
        case 'aes-128-gcm':
            return 16;
        default:
            throw new Error(`Unsupported algorithm ${algo}`);
    }
};
export function encrypt(encryptionKey) {
    const encryptionOptions = {
        algorithm: 'aes-256-gcm',
        outputEncoding: 'base64',
        stringEncoding: 'utf8',
        authTagLength: 16,
        ivLength: 12,
        saltLength: 32,
        iterations: 1,
        digest: 'sha256'
    };
    return (text) => {
        const iv = randomBytes(encryptionOptions.ivLength);
        const salt = randomBytes(encryptionOptions.saltLength);
        const key = pbkdf2Sync(encryptionKey, salt, encryptionOptions.iterations, keyLengthHint(encryptionOptions.algorithm), encryptionOptions.digest);
        const cipher = createCipheriv(encryptionOptions.algorithm, key, iv, {
            authTagLength: encryptionOptions.authTagLength
        });
        const cipherText = Buffer.concat([
            cipher.update(text, encryptionOptions.stringEncoding),
            cipher.final()
        ]);
        return Buffer.concat([salt, iv, cipher.getAuthTag(), cipherText]).toString(encryptionOptions.outputEncoding);
    };
}
export function decrypt(encryptionKey) {
    const encryptionOptions = {
        algorithm: 'aes-256-gcm',
        inputEncoding: 'base64',
        stringEncoding: 'utf8',
        authTagLength: 16,
        ivLength: 12,
        saltLength: 32,
        iterations: 1,
        digest: 'sha256'
    };
    return (encrypted_string) => {
        const buffer = Buffer.from(encrypted_string, encryptionOptions.inputEncoding);
        // data is packed in this sequence [salt iv tag cipherTest]
        const tagStartIndex = encryptionOptions.saltLength + encryptionOptions.ivLength;
        const textStartIndex = tagStartIndex + encryptionOptions.authTagLength;
        const salt = buffer.slice(0, encryptionOptions.saltLength);
        const iv = buffer.slice(encryptionOptions.saltLength, tagStartIndex);
        const tag = buffer.slice(tagStartIndex, textStartIndex);
        const cipherText = buffer.slice(textStartIndex);
        const key = pbkdf2Sync(encryptionKey, salt, encryptionOptions.iterations, keyLengthHint(encryptionOptions.algorithm), encryptionOptions.digest);
        const decipher = createDecipheriv(encryptionOptions.algorithm, key, iv, {
            authTagLength: encryptionOptions.authTagLength
        }).setAuthTag(tag);
        //@ts-ignore
        return `${decipher.update(cipherText, 'binary', encryptionOptions.stringEncoding)}${decipher.final(encryptionOptions.stringEncoding)}`;
    };
}
