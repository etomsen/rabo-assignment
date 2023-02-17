
import { Injectable } from '@angular/core';
import { RaboReferenceModel } from '@rabo/model';
import { RaboValidationErrors, RaboValidator, RaboValidatorPlugin } from './validator.plugin';

@Injectable()
export class RaboReferenceValidatorPlugin implements RaboValidatorPlugin {
    getValidator() {
        return new RaboReferenceValidator();
    }

    isRecordValidator() {
        return false;
    }
}

export class RaboReferenceValidator implements RaboValidator {
    private readonly ids = new Set<number>;

    validateRecord(value: RaboReferenceModel, index: number): RaboValidationErrors | null {
        const errorKey = `reference_${index}`;
        if (typeof value.reference!== 'number' || value.reference <= 0) {
            return {errorKey: `Invalid reference format ${value.reference}`}
        }
        if (this.ids.has(value.reference)) {
            return {errorKey: `Duplicate transaction reference ${value.reference}`}
        }
        this.ids.add(value.reference);
        return null;
    }
}