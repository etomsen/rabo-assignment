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
    readonly dataSource = new MatTableDataSource<RaboReferenceModel & {errors: string}>([]);
    readonly columns = ['reference', 'errors'];
    state?: RaboValidationComponentState;

    @Input()
    set statement(value: RaboStatementModel[]) {
        this.state = ngIfLoadingSymbol;
        this.cdRef.markForCheck();
        const statementErrors = this.service.validateStatement(value);
        this.dataSource.data = [];
        this.state = value;
        this.cdRef.markForCheck();

    }
    
    constructor(private cdRef: ChangeDetectorRef, private service: RaboStatementValidatorService) {}
}