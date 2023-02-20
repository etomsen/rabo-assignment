import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RaboUtilsModule } from '@rabo/utils/utils.module';
import { RaboValidationResultComponent } from './components';
import { RaboBalanceValidatorPlugin, RaboReferenceValidatorPlugin, RaboStatementValidatorService, RABO_BALANCE_VALIDATOR_CONFIG } from './services';
import { RABO_VALIDATOR_PLUGIN_TOKEN } from './services/validator.token';


const MaterialModules = [
    MatTableModule,
    MatIconModule
];

@NgModule({
    imports: [
        CommonModule,
        ...MaterialModules,
        RaboUtilsModule
    ],
    declarations: [
        RaboValidationResultComponent,
    ],
    exports: [
        RaboValidationResultComponent
    ]
})
export class RaboValidatorModule {
    static forRoot(fractionDigits: number): ModuleWithProviders<RaboValidatorModule> {
        return {
            ngModule: RaboValidatorModule,
            providers: [
                RaboStatementValidatorService,
                {
                    provide: RABO_BALANCE_VALIDATOR_CONFIG,
                    useValue: {fractionDigits}
                },
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
        }
    }
}