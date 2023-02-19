import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { RaboStatementModel } from './model';
import { RaboStatementFileParserService } from './parser';
import { fromError, RaboError } from './utils/error';
import { ngIfLoadingSymbol } from './utils/ng-if.directive';

type AppComponentState = RaboStatementModel[] | RaboError | typeof ngIfLoadingSymbol;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    state?: AppComponentState;
    constructor(
        private parserSvc: RaboStatementFileParserService,
        private cdRef: ChangeDetectorRef,
    ) {}

    async onFileChanged(event: Event): Promise<void> { 
        this.state = ngIfLoadingSymbol;
        const target = event.target as HTMLInputElement;
        const files = target.files as FileList;
        if (!files.length) {
            delete this.state;
            this.cdRef.markForCheck();
            return;
        }
        try {
            const parser = await this.parserSvc.getParser(files[0]);
            this.state = await parser.parse(files[0]);
        } catch (error) {
            this.state = fromError(error);
        }
        this.cdRef.markForCheck();
    }
}
