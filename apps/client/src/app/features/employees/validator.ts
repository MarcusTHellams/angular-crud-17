import { AbstractControl } from '@angular/forms';
import { from, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as yup from 'yup';
import { type AnyObject, type Maybe } from 'yup';

const removePreviousErrors = (control: AbstractControl) => {
  const form = control;
  Object.keys(form) // => ['id', 'title', 'companies', ... ]
    .forEach((key) => {
      const formControl = control.get(key); // control === FormGroup (in form level)
      if (formControl!.errors) {
        // { required: true, maxlength: true, yup_required..., yup_minlength, ... }
        const errorsWithoutYupErrors = Object.keys(formControl!.errors).filter(
          (k) => !k.startsWith('yup_'),
        ); // etc. yup_required, yup_maxlength
        const hasErrors = !!Object.keys(errorsWithoutYupErrors).length;
        formControl!.setErrors(hasErrors ? errorsWithoutYupErrors : null);
      }
    });
};

export const createYupValidator = ({
  schema,
  context = undefined,
}: {
  schema: yup.ObjectSchema<Maybe<AnyObject>>;
  context?: Function;
}) => {
  return (control: AbstractControl) => {
    const form = control.value; // form level
    // { id, title, companies ... }

    const yupVallation = schema.validate(form, {
      abortEarly: false,
      context: context?.(),
    }); // => Promise
    return from(yupVallation).pipe(
      tap(() => {
        removePreviousErrors(control);
      }),
      map(() => null),
      catchError((yupErrors) => {
        // => { inner: [{ path: 'id', type: 'required', ... }, { ... }] }

        yupErrors.inner?.forEach((err: yup.ValidationError) => {
          const { path, type } = err; // { path: 'id', type: 'required' } // form === control
          const formControl = control.get(path as string);
          formControl!.setErrors({ [`yup_${type}`]: true });
        });
        return of(null); // the form is always valid, but the fields may not.
      }),
    ); // => Observable
  };
};
