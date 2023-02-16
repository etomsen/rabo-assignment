import { Injectable, Injector } from '@angular/core';
import { RaboReferenceModel, RaboStatementModel } from '@rabo/model';
import { RaboValidationResult, RaboValidatorPlugin } from './validator.plugin';
import { RABO_VALIDATOR_PLUGIN_TOKEN } from './validator.token';

@Injectable()
export class RaboStatementValidatorService {
    private plugins: Array<RaboValidatorPlugin> = [];

    constructor(private injector: Injector) {
    }

    private getPlugins() {
        const plugins = this.plugins.length ? this.plugins: this.injector.get(RABO_VALIDATOR_PLUGIN_TOKEN);
        this.plugins = Array.isArray(plugins) ? plugins : [plugins];
        return this.plugins;
    }

    validateStatement(statement: Array<RaboStatementModel>): Array<RaboReferenceModel & {errors: RaboValidationResult}> {
        const validators = this.getPlugins().map(p => p.getValidator());
        return statement.map((record, index) => {
            return {
                reference: record.reference,
                errors: validators.reduce((recordErrors, v) => {
                    const validatorErrors = v.validateRecord(record, index);
                    if (validatorErrors && validatorErrors.length) {
                        recordErrors = [...recordErrors, ...validatorErrors];
                    }
                    return recordErrors;
                }, [] as RaboValidationResult)
            };
        });
    }
}