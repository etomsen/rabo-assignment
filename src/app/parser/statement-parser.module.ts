
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RaboStatementFileParserService } from './services';
import RaboCsvStatementParser from './services/csv/csv-parser.service';
import { defaultConfig, RABO_STATEMENT_PARSER_CFG } from './services/statement-parser.config';
import RaboXmlStatementParser from './services/xml/xml-parser.service';

@NgModule({
    imports: [CommonModule],
})
export class RaboStatementParserModule {
    static forRoot(fractionDigits: number): ModuleWithProviders<RaboStatementParserModule > {
        return {
            ngModule: RaboStatementParserModule,
            providers: [
                {
                    provide: RABO_STATEMENT_PARSER_CFG,
                    useValue: {...defaultConfig, fractionDigits}
                },
                RaboStatementFileParserService,
                RaboXmlStatementParser,
                RaboCsvStatementParser,
            ],
        }
    }
}