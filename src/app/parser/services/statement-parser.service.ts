import { Injectable, Injector } from '@angular/core';
import { RaboStatementParser } from '@rabo/model';
import { fromError, RaboError } from '@rabo/utils/error';
import RaboCsvStatementParser from './csv/csv-parser.service';
import { RaboStatementParserCfg } from './statement-parser.config';
import RaboXmlStatementParser from './xml/xml-parser.service';

@Injectable()
export class RaboStatementFileParserService {
    static parsersMap = new Map<string, { new(cfg:  RaboStatementParserCfg): RaboStatementParser}>;

    static registerParser(fileType: string, parserClass: { new(cfg: RaboStatementParserCfg): RaboStatementParser}) {
        RaboStatementFileParserService.parsersMap.set(fileType, parserClass);
    }

    constructor(private injector: Injector) {}

    async getParser(file: File): Promise<RaboStatementParser> {
        if (!RaboStatementFileParserService.parsersMap.has(file.type)) {
            throw new RaboError('No parser found', `No statement file parser found for type ${file.type}`);
        }
        try {
            return this.injector.get(RaboStatementFileParserService.parsersMap.get(file.type));
        } catch (error) {
            throw fromError(error, `No statement file parser found for type ${file.type}`);
        }
    }
}

RaboStatementFileParserService.registerParser('text/xml', RaboXmlStatementParser);
RaboStatementFileParserService.registerParser('text/csv', RaboCsvStatementParser);
