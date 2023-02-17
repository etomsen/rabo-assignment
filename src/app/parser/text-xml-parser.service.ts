import { RaboStatementModel, RaboStatementParser } from '@rabo/model';

export default class RaboXmlStatementParser implements RaboStatementParser {
    parse(file: File): Promise<RaboStatementModel[]> {
        throw new Error('Not implemented yet');
    }
}