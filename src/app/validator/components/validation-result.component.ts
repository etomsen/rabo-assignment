import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RaboReferenceModel, RaboStatementModel } from '@rabo/model';
import { RaboError } from '@rabo/utils/error';
import { ngIfLoadingSymbol } from '@rabo/utils/ng-if.directive';
import { RaboStatementValidatorService } from '../services/validator.service';

type RaboValidationComponentState = RaboStatementModel[] | RaboError | typeof ngIfLoadingSymbol;

@Component({
    templateUrl: './validation-result.component.html',
    styleUrls: ['./validation-result.component.scss'],
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
        // TODO: it would be good to move the validate to web-worker in order not to block the UI
        this.dataSource.data = this.validate(value);
        this.state = value;

    }

    validate(statement: Array<RaboStatementModel>) {
        const recordsValidation = this.service.validateRecords(statement);
        const statementValidation = this.service.validateStatement(statement);
        const errorsByReference = new Map(Object.keys(recordsValidation).map((reference) => {
            const errors = Object.values(recordsValidation[+reference]).join(', ');
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