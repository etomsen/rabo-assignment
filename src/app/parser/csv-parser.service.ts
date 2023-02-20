import { Injectable } from '@angular/core';
import { RaboStatementModel, RaboStatementParser } from '@rabo/model';
import { RaboError } from '@rabo/utils/error';
import { readFileToString } from './parser-file.utils';

const delimiter = ',';
const endOfLine = '\n';
const parserFields: Array<keyof RaboStatementModel> = ['reference', 'iban', 'description', 'start', 'mutation', 'end'];

function parseCsv(csvString: string): RaboStatementModel[] {
    const header = csvString.slice(0, csvString.indexOf(endOfLine)).split(delimiter);
    if (header.length !== parserFields.length) {
        throw new RaboError('CsvFileParser', `CSV statement file is corrupted: header length mismatch`);
    }
    const records = csvString.slice(csvString.indexOf(endOfLine)+ 1).split(endOfLine);
    return records
        .map(parseCsvRow)
        .filter((model): model is RaboStatementModel => model !== null);
}


export function parseCsvRow(row: string): RaboStatementModel | null {
        const fields = row.split(delimiter);
        const result: RaboStatementModel = {
            reference: +fields[parserFields.indexOf('reference')],
            iban: fields[parserFields.indexOf('iban')],
            description: fields[parserFields.indexOf('description')],
            start: +fields[parserFields.indexOf('start')],
            end: +fields[parserFields.indexOf('end')],
            mutation: +fields[parserFields.indexOf('mutation')],
        };
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

@Injectable({
    providedIn: 'root'
})
export default class RaboCsvStatementParser implements RaboStatementParser {
   
    async parse(file: File): Promise<RaboStatementModel[]> {
        const fileContent = await readFileToString(file);
        const statement = parseCsv(fileContent);
        return Promise.resolve(statement)
    }
}

