export class RaboError extends Error {
    constructor(msg: string, public raboMsg: string) {
        super(msg);
    }
}

export function fromError(error: unknown, raboMsg = 'Unhandled error'): RaboError {
    if (error instanceof RaboError || Object.prototype.hasOwnProperty.call(error, 'raboMsg')) {
        return error as RaboError;
    }
    if (error instanceof Error) {
       Object.assign(error, {raboMsg });
       return error as RaboError;
    }
    if (typeof error === 'string') {
        return new RaboError(error, raboMsg);
    }
    return new RaboError(raboMsg, raboMsg);
}