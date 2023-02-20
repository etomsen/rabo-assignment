import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RaboReferenceModel, RaboStatementModel } from '@rabo/model';
import { RaboError } from '@rabo/utils/error';
import { ngIfLoadingSymbol } from '@rabo/utils/ng-if.directive';
import { RaboStatementValidatorService } from '../services/validator.service';

type RaboValidationComponentState = RaboStatementModel[] | RaboError | typeof ngIfLoadingSymbol;

@Component({
    templateUrl: './validation-result.component.html',
    selector: 'rabo-validation-result',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaboValidationResultComponent {
    readonly dataSource = new MatTableDataSource<RaboReferenceModel & {errors?: string}>([]);
    readonly columns = ['reference', 'errors'];
    state?: RaboValidationComponentState;

    @Input()
    set statement(value: RaboStatementModel[]) {
        this.state = ngIfLoadingSymbol;
        this.cdRef.markForCheck();
        this.dataSource.data = this.validate(value);
        this.state = value;
        this.cdRef.markForCheck();

    }

    validate(statement: Array<RaboStatementModel>) {
        const recordValidation = this.service.validateRecords(statement);
        const statementValidation = this.service.validateStatement(statement);
        const errorsByReference = new Map(Object.keys(recordValidation).map((reference) => {
            const errors = Object.values(recordValidation[+reference]).join(', ');
            return [+reference, errors];
        }));
        Object.keys(statementValidation).forEach(errKey => {
            statementValidation[errKey].references.forEach(ref => {
                const errorMsg = statementValidation[errKey].error;
                if (!errorsByReference.has(ref)) {
                    errorsByReference.set(ref, errorMsg);
                } else {
                    errorsByReference.set(ref, [errorsByReference.get(ref), errorMsg].join(', '));
                }
            })
        });
        return Array.from(errorsByReference.keys())
            .map(reference => ({reference, errors: errorsByReference.get(reference)}))
    }
    
    constructor(private cdRef: ChangeDetectorRef, private service: RaboStatementValidatorService) {}
}