import { Inject, Injectable } from '@angular/core';
import { RaboStatementModel, RaboStatementParser } from '@rabo/model';
import { fromError, RaboError } from '@rabo/utils/error';
import { readFileToString } from '../../utils/parser-file.utils';
import { RABO_STATEMENT_PARSER_CFG, RaboStatementParserCfg } from '../statement-parser.config';


@Injectable()
export default class RaboCsvStatementParser implements RaboStatementParser {
   
    constructor(@Inject(RABO_STATEMENT_PARSER_CFG) private cfg: RaboStatementParserCfg) {}

    async parse(file: File): Promise<RaboStatementModel[]> {
        try {
            const fileContent = await readFileToString(file);
            const statement = this.parseCsv(fileContent);
            return Promise.resolve(statement)
        } catch (error) {
            return Promise.reject(fromError(error));    
        }
    }

    parseCsv(csvString: string): RaboStatementModel[] {
        const header = csvString.slice(0, csvString.indexOf(this.cfg.endOfLine)).split(this.cfg.delimiter);
        if (header.length !== this.cfg.parserFields.length) {
            throw new RaboError('CsvFileParser', `CSV statement file is corrupted: header length mismatch`);
        }
        const records = csvString.slice(csvString.indexOf(this.cfg.endOfLine)+ 1).split(this.cfg.endOfLine);
        return records
            .map(this.parseCsvRow.bind(this))
            .filter((model): model is RaboStatementModel => model !== null);
    }

    parseNumericField(fields: string[], fieldName: keyof RaboStatementModel) {
        const result = fields[this.cfg.parserFields.indexOf(fieldName)];
        if (!result) {
            return NaN;
        }
        if (result.split('.').length === 2 && result.split('.')[1].length > this.cfg.fractionDigits) {
            console.error(`${result} numeric field has more digits than in config`);
            return NaN;
        }
        return +result;
    }

    parseCsvRow(row: string): RaboStatementModel | null {
        if (!row) {
            return null;
        }
        const fields = row.split(this.cfg.delimiter);
        const result: RaboStatementModel = {
            reference: +fields[this.cfg.parserFields.indexOf('reference')],
            iban: fields[this.cfg.parserFields.indexOf('iban')],
            description: fields[this.cfg.parserFields.indexOf('description')],
            start: this.parseNumericField(fields, 'start'),
            end: this.parseNumericField(fields, 'end'),
            mutation: this.parseNumericField(fields, 'mutation'),
        };
        // TODO: report parsing errors?
        if (Number.isNaN(result.reference)) {
            return null;
        }
        if (Number.isNaN(result.start)) {
            return null;
        }
        if (Number.isNaN(result.end)) {
            return null;
        }
        if (Number.isNaN(result.mutation)) {
            return null;
        }
        return result;
    }
}

