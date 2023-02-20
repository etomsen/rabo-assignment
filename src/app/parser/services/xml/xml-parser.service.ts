import { Injectable } from '@angular/core';
import { RaboStatementModel, RaboStatementParser } from '@rabo/model';
import { fromError } from '@rabo/utils/error';
import { readFileToString } from '../../utils/parser-file.utils';
import { parseStatementRecord } from './xml-parser.utils';


@Injectable()
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

