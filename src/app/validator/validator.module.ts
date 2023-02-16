import { ModuleWithProviders, NgModule } from '@angular/core';
import { RaboBalanceValidatorPlugin } from './balance-validator.plugin';
import { RaboReferenceValidatorPlugin } from './reference-validator.plugin';
import { RaboStatementValidatorService } from './validator.service';
import { RABO_VALIDATOR_PLUGIN_TOKEN } from './validator.token';

@NgModule()
export class RaboValidatorPluginModule {
    static forRoot(): ModuleWithProviders<RaboValidatorPluginModule> {
        return {
            ngModule: RaboValidatorPluginModule,
            providers: [
                RaboStatementValidatorService,
                {
                    provide: RABO_VALIDATOR_PLUGIN_TOKEN,
                    useClass: RaboBalanceValidatorPlugin,
                    multi: true,
                },
                {
                    provide: RABO_VALIDATOR_PLUGIN_TOKEN,
                    useClass: RaboReferenceValidatorPlugin,
                    multi: true,
                },
            ],
        };
    }
}