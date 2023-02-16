export type RaboValidationResult = string[];

export interface RaboValidator {
    validateRecord(value: unknown, index: number): RaboValidationResult | null;
}

export interface RaboValidatorPlugin {
    getValidator(): RaboValidator;
}