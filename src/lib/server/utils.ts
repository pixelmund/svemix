export class Redirect {
    status: number;
    location: string;

    constructor(status: number, location: string) {
        this.status = status;
        this.location = location;
    }
}


/**
 * Creates a `Redirect` object. If thrown during request handling, Svemix will
 * return a redirect response.
 * @param {number} status
 * @param {string} location
 */
export function redirect(status: number, location: string) {
    if (isNaN(status) || status < 300 || status > 399) {
        throw new Error('Invalid status code');
    }

    return new Redirect(status, location);
}