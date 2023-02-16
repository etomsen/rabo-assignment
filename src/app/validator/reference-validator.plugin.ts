
import { Injectable } from '@angular/core';
import { RaboReferenceModel } from '@rabo/model';
import { RaboValidationResult, RaboValidator, RaboValidatorPlugin } from './validator.plugin';

@Injectable()
export class RaboReferenceValidatorPlugin implements RaboValidatorPlugin {
    getValidator() {
        return new RaboReferenceValidator();
    }
}

export class RaboReferenceValidator implements RaboValidator {
    private readonly ids = new Set<number>;

    validateRecord(value: RaboReferenceModel): RaboValidationResult | null {
        if (typeof value.reference!== 'number' || value.reference <= 0) {
            return [`Invalid reference format`];
        }
        if (this.ids.has(value.reference)) {
            return [`Duplicate transaction reference`];
        }
        this.ids.add(value.reference);
        return null;
    }
}