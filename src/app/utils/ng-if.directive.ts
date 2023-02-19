import { NgIf } from '@angular/common';
import { Directive, Input, OnChanges, TemplateRef } from '@angular/core';

interface NgIfContext<T> {
    $implicit: T;
    ngIf: T;
}

export const ngIfLoadingSymbol = Symbol('ngIfOr');

@Directive({
    selector: '[ngIf][ngIfOr],[ngIf][ngIfBut]'
})
export class NgIfDirective<T> implements OnChanges {
    @Input()
    ngIf: unknown = false;
    
    @Input()
    ngIfThen: TemplateRef<NgIfContext<T>> = this.templateRef;
    
    @Input()
    ngIfElse: TemplateRef<NgIfContext<T>> | null = null;
    
    @Input()
    ngIfOr: TemplateRef<NgIfContext<T>> | null = null;
    
    @Input()
    ngIfBut: TemplateRef<NgIfContext<T>> | null = null;
    
    constructor(
        private readonly directive: NgIf,
        private readonly templateRef: TemplateRef<NgIfContext<T>>
    ) {}
    
    ngOnChanges() {
        if (this.ngIf === ngIfLoadingSymbol) {
            this.directive.ngIfThen = this.ngIfOr ? this.ngIfOr : null;
            this.directive.ngIfElse = null;
            return;
        }
        
        if (this.ngIf instanceof Error) {
            this.directive.ngIfThen = this.ngIfBut ? this.ngIfBut : null;
            this.directive.ngIfElse = null;
            return;
        }
        if (this.directive.ngIfThen !== this.ngIfThen) {
            this.directive.ngIfThen = this.ngIfThen;
        }
        if (this.directive.ngIfElse !== this.ngIfElse) {
            this.directive.ngIfElse = this.ngIfElse;
        }
    }
}
