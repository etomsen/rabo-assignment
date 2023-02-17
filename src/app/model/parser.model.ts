import { RaboStatementModel } from './statement.model';

export interface RaboStatementParser {
    parse(file: File): Promise<RaboStatementModel[]>;
}