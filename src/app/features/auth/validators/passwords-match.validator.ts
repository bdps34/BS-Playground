import { SchemaPath, validate } from '@angular/forms/signals';

export function passwordsMatch(
  confirmPasswordPath: SchemaPath<string>,
  passwordPath: SchemaPath<string>
) {
  validate(confirmPasswordPath, ({ value, valueOf }) => {
    // Defer to the `required` validator for the empty case, so an untouched/empty
    // field doesn't show both "required" and "doesn't match" at once.
    if (!value()) {
      return null;
    }
    return value() !== valueOf(passwordPath)
      ? { kind: 'passwordMismatch', message: 'Passwords do not match' }
      : null;
  });
}
