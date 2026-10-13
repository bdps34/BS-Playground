import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormField, email, form, required, submit } from '@angular/forms/signals';

import { SignUpFormModel } from '../models/sign-up-form.model';
import { passwordsMatch } from '../validators/passwords-match.validator';
import { AuthService } from '../../../core/auth/auth.service';
import { UserProfileService } from '../../../core/auth/user-profile.service';

@Component({
  selector: 'sign-up',
  imports: [NgOptimizedImage, RouterLink, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  private authService = inject(AuthService);
  private userProfileService = inject(UserProfileService);
  private router = inject(Router);

  private model = signal<SignUpFormModel>({ email: '', password: '', confirmPassword: '' });

  signUpForm = form(this.model, (schema) => {
    required(schema.email, { message: 'Email is required' });
    email(schema.email, { message: 'Enter a valid email address' });
    required(schema.password, { message: 'Password is required' });
    required(schema.confirmPassword, { message: 'Please confirm your password' });
    passwordsMatch(schema.confirmPassword, schema.password);
  });

  passwordVisible = signal(false);
  confirmPasswordVisible = signal(false);

  togglePasswordVisibility() {
    this.passwordVisible.update((visible) => !visible);
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible.update((visible) => !visible);
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    await submit(this.signUpForm, async () => {
      const { email, password } = this.model();
      const success = await this.authService.createUser(email, password);

      if (success) {
        // authService writes straight to local storage and never touches this service (by
        // design), so pick up whatever it just wrote here instead.
        this.userProfileService.reload();
        await this.router.navigateByUrl('/home');
      }
    });
  }
}
