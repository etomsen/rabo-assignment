import { Injectable } from '@angular/core';
import { RaboBalanceModel } from '@rabo/model';
import { RaboValidationResult, RaboValidator, RaboValidatorPlugin } from './validator.plugin';

@Injectable()
export class RaboBalanceValidatorPlugin implements RaboValidatorPlugin {
    getValidator() {
        return new RaboBalanceValidator();
    }
}

export class RaboBalanceValidator implements RaboValidator {
    validateRecord(value: RaboBalanceModel): RaboValidationResult | null {
        if (typeof value.start !== 'number') {
            return [`Invalid start balance`];
        }
        if (typeof value.end !== 'number') {
            return [`Invalid end balance`];
        }
        if (typeof value.mutation !== 'number') {
            return [`Invalid mutation value`];
        }
        if (value.start + value.mutation !== value.end) {
            return [`Balance calculation mismatch`];
        }
        return null;
    }
}