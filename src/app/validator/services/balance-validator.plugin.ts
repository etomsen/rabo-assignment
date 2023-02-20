import { Inject, InjectionToken, Optional } from '@angular/core';
import { Injectable, Injector } from '@angular/core';
import { RaboBalanceModel } from '@rabo/model';
import { RaboValidationErrors, RaboValidator, RaboValidatorPlugin } from './validator.plugin';

export interface RaboBalanceValidatorCfg {
    fractionDigits: number
};

export const RABO_BALANCE_VALIDATOR_CONFIG = new InjectionToken<RaboBalanceValidatorCfg>('RABO_BALANCE_VALIDATOR_CONFIG');

@Injectable()
export class RaboBalanceValidatorPlugin implements RaboValidatorPlugin {
    constructor(@Inject(RABO_BALANCE_VALIDATOR_CONFIG) @Optional() private readonly cfg: RaboBalanceValidatorCfg) {
    }

    getValidator() {
        return new RaboBalanceValidator(this.cfg || {fractionDigits: 4});
    }

    isRecordValidator(): boolean {
        return true;
    }
}

export class RaboBalanceValidator implements RaboValidator {
    constructor(private readonly config: RaboBalanceValidatorCfg) {}

    validateRecord(value: RaboBalanceModel): RaboValidationErrors | null {
        if (value.start + value.mutation !== value.end) {
            // to test the config
            console.log(`${value.start} + ${value.mutation} !== ${value.end}`);
        }
        if ((value.start + value.mutation).toFixed(this.config.fractionDigits)
            !== (value.end).toFixed(this.config.fractionDigits)
        ) {
            return {balance: 'Balance calculation mismatch'};
        }
        return null;
    }
}