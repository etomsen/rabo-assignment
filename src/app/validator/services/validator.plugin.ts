export type RaboValidationErrors = {[key: string]: string}

export interface RaboValidator {
    validateRecord(value: unknown, index: number): RaboValidationErrors | null;
}

export interface RaboValidatorPlugin {
    getValidator(): RaboValidator;
    isRecordValidator(): boolean;
}