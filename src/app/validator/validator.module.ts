import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RaboUtilsModule } from '@rabo/utils/utils.module';
import { RaboBalanceValidatorPlugin } from './balance-validator.plugin';
import { RaboValidationResultComponent } from './components';
import { RaboReferenceValidatorPlugin } from './reference-validator.plugin';
import { RaboStatementValidatorService } from './validator.service';
import { RABO_VALIDATOR_PLUGIN_TOKEN } from './validator.token';


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
    static forRoot(): ModuleWithProviders<RaboValidatorModule> {
        return {
            ngModule: RaboValidatorModule,
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