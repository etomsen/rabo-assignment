import { InjectionToken } from '@angular/core';
import { RaboValidatorPlugin } from './validator.plugin';

export const RABO_VALIDATOR_PLUGIN_TOKEN = new InjectionToken<RaboValidatorPlugin>('RABO_VALIDATOR_TOKEN');