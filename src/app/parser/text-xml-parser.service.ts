import { Injectable } from '@angular/core';
import { RaboBalanceModel, RaboReferenceModel, RaboStatementModel, RaboStatementParser } from '@rabo/model';
import { fromError, RaboError } from '@rabo/utils/error';

export function readFileToString(file: File) {
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = (error) => {
            reject(fromError(error, 'Error parsing XML statement file'));
        };
        reader.readAsText(file);
    });
}

export function parseStatementRecord(record: Element): RaboStatementModel {
    const refModel = parseReferenceRecord(record);
    const balanceModel = parseRaboBalanceRecord(record);
    return {
        ...refModel,
        ...balanceModel,
        iban: '123',
        description: '',
    };
}

export function parseReferenceRecord(record: Element): RaboReferenceModel {
    const reference = record.attributes.getNamedItem('reference')?.value;
    if (!reference || !Number.isInteger(reference)) {
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
        end: parseNumberByTag(record, 'end'),
        start: parseNumberByTag(record, 'start'),
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
               // skip malformed records 
            }
        }
        return result;
    }
}

