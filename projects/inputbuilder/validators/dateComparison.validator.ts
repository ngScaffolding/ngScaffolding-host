import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';

export function dateLaterThanValidator(sourceField: string, compareField: string): ValidatorFn {
    return (formGroup: FormGroup): { [key: string]: any } | null => {
        const source = formGroup.get('sourceField').value;
        const compare = formGroup.get('compareField').value;
        return source < compare ? null : { laterThan: true };
    };
}

