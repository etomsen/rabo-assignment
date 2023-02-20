import { Injectable, Injector } from '@angular/core';
import { RaboStatementModel } from '@rabo/model';
import { RaboValidationErrors, RaboValidator, RaboValidatorPlugin } from './validator.plugin';
import { RABO_VALIDATOR_PLUGIN_TOKEN } from './validator.token';

// Record validation result are grouped per reference
export type RaboValidationResult = {[reference: number]: RaboValidationErrors}; 
// statement validation result are grouped per errorKey
export type RaboStatementValidationResult = {[key: string]: {references: Array<number>, error: string}};

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


    validateRecords(statement: Array<RaboStatementModel>): RaboValidationResult { 
        const recordValidators = this.getPlugins().filter(p => p.isRecordValidator()).map(p => p.getValidator());
        return statement.reduce((result, record, index) => {
            const errors = getRecordValidationErrors(recordValidators, record, index);
            if (!errors) {
                return result;
            }
            return {
                ...result,
                [record.reference]: errors,
            };
        }, {});
    }

    validateStatement(statement: Array<RaboStatementModel>): RaboStatementValidationResult {
        const statementValidators = this.getPlugins().filter(p => !p.isRecordValidator()).map(p => p.getValidator());
        return statement.reduce((result, record, index) => {
            const recordErrors = getRecordValidationErrors(statementValidators, record, index);
            if (!recordErrors) {
                return result;
            }
            return Object.keys(recordErrors).reduce((newValidationResult, recordError) => {
                if (!newValidationResult[recordError]) {
                    newValidationResult = {...newValidationResult, [recordError]: {references: [], error: recordErrors[recordError]}};
                }
                newValidationResult[recordError].references.push(record.reference);
                return newValidationResult;

            }, result);
        }, {} as RaboStatementValidationResult);
    }
}

export function getRecordValidationErrors(validators: RaboValidator[], record: RaboStatementModel, index: number) {
    return validators.reduce((recordErrors, v) => {
        const validatorErrors = v.validateRecord(record, index);
        if (validatorErrors) {
            if (!recordErrors) {
                return validatorErrors;
            } else {
                return { ...recordErrors, ...validatorErrors };
            }
        }
        return recordErrors;
    }, null as RaboValidationErrors | null)
}
