import { type AbstractControl, type ValidationErrors, type ValidatorFn } from '@angular/forms';

export function sameAs(controlName1: string, controlName2: string): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
        if (!c.parent) {
            return null;
        }

        const password = c.parent.get(controlName1)?.value;
        const confirmPassword = c.parent.get(controlName2)?.value;

        return password === confirmPassword ? null : { mismatch: true };
    };
}
