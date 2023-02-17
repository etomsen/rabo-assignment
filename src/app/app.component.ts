import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RaboStatementFileParserService } from './parser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    constructor(private parserSvc: RaboStatementFileParserService) {}

    async onFileChanged(event: Event): Promise<void> { 
        const target = event.target as HTMLInputElement;
        const files = target.files as FileList;
        if (!files.length) {
            return;
        }
        try {
            const parser = await this.parserSvc.getParser(files[0]);
            const statement = await parser.parse(files[0]);
        } catch (error) {
            debugger;    
        }
    }


}
