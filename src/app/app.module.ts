import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RaboUtilsModule } from './utils/utils.module';
import { RaboValidatorModule } from './validator/validator.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        NoopAnimationsModule,
        RaboValidatorModule.forRoot(),
        RaboUtilsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
