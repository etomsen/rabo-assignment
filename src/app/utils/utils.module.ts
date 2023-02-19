import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIfDirective } from './ng-if.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    NgIfDirective,
  ],
  exports: [
    NgIfDirective,
  ]
})
export class RaboUtilsModule {}
