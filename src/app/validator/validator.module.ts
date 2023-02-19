import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RaboUtilsModule } from '@rabo/utils/utils.module';
import { RaboValidationResultComponent } from './components';
import { RaboBalanceValidatorPlugin, RaboReferenceValidatorPlugin, RaboStatementValidatorService } from './services';
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
    declarations: [
        RaboValidationResultComponent,
    ],
    exports: [
        RaboValidationResultComponent
    ]
})
export class RaboValidatorModule {}