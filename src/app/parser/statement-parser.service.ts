import { Injectable, Injector, ProviderToken } from '@angular/core';
import { RaboStatementParser } from '@rabo/model';
import type RaboXmlStatementParser from './text-xml-parser.service';            
import { fromError } from '@rabo/utils/error';

@Injectable({ providedIn: 'root' })
export class RaboStatementFileParserService {
    constructor(private injector: Injector) {}

    private async get<T>(providerLoader: () => Promise<ProviderToken<T>>) {
        return this.injector.get(await providerLoader());
    }

    async getParser(file: File): Promise<RaboStatementParser> {
        // const parserName = file.type.replace('/', '-');
        try {
            return await this.get<RaboXmlStatementParser>(() =>
                // import(`./${parserName}-parser.service`).then((m) => m.default)
                import('./text-xml-parser.service').then((m) => m.default)
            );
        } catch (error) {
            debugger;
            throw fromError(error, `No statement file parser found for type ${file.type}`);
        }
    }
}