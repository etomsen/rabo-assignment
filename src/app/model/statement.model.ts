import { RaboBalanceModel } from './balance.model';
import { RaboReferenceModel } from './reference.model';

export interface RaboStatementModel extends RaboReferenceModel, RaboBalanceModel {
   iban: string;
   description: string; 
}