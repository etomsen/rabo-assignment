import { Injectable } from '@angular/core';
import { RaboBalanceModel } from '@rabo/model';
import { RaboValidationErrors, RaboValidator, RaboValidatorPlugin } from './validator.plugin';

@Injectable()
export class RaboBalanceValidatorPlugin implements RaboValidatorPlugin {
    getValidator() {
        return new RaboBalanceValidator();
    }

    isRecordValidator(): boolean {
        return true;
    }
}

export class RaboBalanceValidator implements RaboValidator {
    validateRecord(value: RaboBalanceModel): RaboValidationErrors | null {
        if (typeof value.start !== 'number') {
            return {'balance': 'Invalid start balance'};
        }
        if (typeof value.end !== 'number') {
            return {'balance': 'Invalid end balance'};
        }
        if (typeof value.mutation !== 'number') {
            return {'balance': 'Invalid mutation value'};
        }
        if (value.start + value.mutation !== value.end) {
            return {'balance': 'Balance calculation mismatch'};
        }
        return null;
    }
}