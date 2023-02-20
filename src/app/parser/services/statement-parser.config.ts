import { InjectionToken } from '@angular/core';
import { RaboStatementModel } from '@rabo/model';

export interface RaboStatementParserCfg {
    fractionDigits: number;
    delimiter: string;
    endOfLine: string; 
    parserFields: Array<keyof RaboStatementModel>;
}

export const defaultConfig: RaboStatementParserCfg = {
    delimiter: ',',
    endOfLine: '\n',
    parserFields: ['reference', 'iban', 'description', 'start', 'mutation', 'end'],
    fractionDigits: 4,
}

export const RABO_STATEMENT_PARSER_CFG = new InjectionToken<RaboStatementParserCfg>('RABO_STATEMENT_PARSER_CFG');