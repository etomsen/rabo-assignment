export class RaboError extends Error {
    constructor(msg: string, public raboMsg: string) {
        super(msg);
    }
}

export function fromError(error: unknown, raboMsg = 'Unhandled error') {
    if (error instanceof RaboError) {
        return error as RaboError;
    }
    if (error instanceof Error) {
       Object.assign(error, {raboMsg });
       return error;
    }
    if (typeof error === 'string') {
        return new RaboError(error, raboMsg);
    }
    return new RaboError(raboMsg, raboMsg);
}