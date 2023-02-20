import { Injectable } from '@angular/core';
import { RaboBalanceModel, RaboReferenceModel, RaboStatementModel, RaboStatementParser } from '@rabo/model';
import { fromError, RaboError } from '@rabo/utils/error';
import { readFileToString } from './parser-file.utils';

export function parseStatementRecord(record: Element): RaboStatementModel {
    const refModel = parseReferenceRecord(record);
    const balanceModel = parseRaboBalanceRecord(record);
    return {
        ...refModel,
        ...balanceModel,
        iban: parseByTag(record, 'accountNumber'),
        description: parseByTag(record, 'description'),
    };
}

export function parseReferenceRecord(record: Element): RaboReferenceModel {
    const reference = record.attributes.getNamedItem('reference')?.value;
    if (!reference || Number.isNaN(reference)) {
        throw new RaboError('XmlParserError', 'Record does not have a reference');
    }
    return {
        reference: +reference,
    } 
}

export function parseByTag(record: Element, tag: string): string {
    const tagValue = record.getElementsByTagName(tag);
    if (!tagValue || tagValue.length !== 1) {
        throw new RaboError('XmlParserError', `Record does not have a required tag ${tag}`);
    }
    return tagValue[0].textContent || '';
}

export function parseNumberByTag(record: Element, tag: string): number {
    const tagValue = record.getElementsByTagName(tag);
    if (!tagValue || tagValue.length !== 1) {
        throw new RaboError('XmlParserError', `Record does not have a required tag ${tag}`);
    }
    const tagContent = tagValue[0].textContent;
    if (!tagContent || Number.isNaN(tagContent)) {
        throw new RaboError('XmlParserError', `Record tag ${tag} is not a valid number`);
    }
    return +tagContent;
}

export function parseRaboBalanceRecord(record: Element): RaboBalanceModel {
    return {
        mutation: parseNumberByTag(record, 'mutation'),
        end: parseNumberByTag(record, 'endBalance'),
        start: parseNumberByTag(record, 'startBalance'),
    }
} 

@Injectable({
    providedIn: 'root'
})
export default class RaboXmlStatementParser implements RaboStatementParser {
   
    async parse(file: File): Promise<RaboStatementModel[]> {
        const fileContent = await readFileToString(file);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(fileContent, 'text/xml');
        const records = xmlDoc.getElementsByTagName('record');
        const result: RaboStatementModel[] = [];
        for (let i = 0; i < records.length; i++) {
            try {
                const record = records.item(i);
                if (record) {
                    result.push(parseStatementRecord(record));
                }
            } catch (error) {
                // TODO: skip malformed records or reject the whole file?
               // TODO: log errors in solid way 
                console.error(fromError(error).raboMsg);
            }
        }
        return result;
    }
}

