import { Injectable, Injector } from '@angular/core';
import { RaboReferenceModel, RaboStatementModel } from '@rabo/model';
import { RaboValidationErrors, RaboValidator, RaboValidatorPlugin } from './validator.plugin';
import { RABO_VALIDATOR_PLUGIN_TOKEN } from './validator.token';

@Injectable()
export class RaboStatementValidatorService {
    private plugins: Array<RaboValidatorPlugin> = []; // to lazy-load plugin instances

    constructor(private injector: Injector) {
    }

    private getPlugins() {
        const plugins = this.plugins.length ? this.plugins: this.injector.get(RABO_VALIDATOR_PLUGIN_TOKEN);
        this.plugins = Array.isArray(plugins) ? plugins : [plugins];
        return this.plugins;
    }

    validateRecords(statement: Array<RaboStatementModel>): Array<RaboReferenceModel & {errors: RaboValidationErrors}> {
        const recordValidators = this.getPlugins().filter(p => p.isRecordValidator()).map(p => p.getValidator());
        return statement.map((record, index) => {
            return {
                reference: record.reference,
                errors: getRecordValidationErrors(recordValidators, record, index)
            };
        });
    }

    validateStatement(statement: Array<RaboStatementModel>): RaboValidationErrors {
        const statementValidators = this.getPlugins().filter(p => !p.isRecordValidator()).map(p => p.getValidator());
        return statement.reduce((statementErrors, record, index) => {
            const recordErrors = getRecordValidationErrors(statementValidators, record, index);
            return recordErrors ? {...statementErrors, ...recordErrors} : statementErrors;
        }, {} as RaboValidationErrors);
    }
}

export function getRecordValidationErrors(validators: RaboValidator[], record: RaboStatementModel, index: number) {
    return validators.reduce((recordErrors, v) => {
        const validatorErrors = v.validateRecord(record, index);
        if (validatorErrors) {
            recordErrors = { ...recordErrors, ...validatorErrors };
        }
        return recordErrors;
    }, {} as RaboValidationErrors)
}
