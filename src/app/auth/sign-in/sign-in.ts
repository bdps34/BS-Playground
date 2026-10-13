import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormField, email, form, required, submit } from '@angular/forms/signals';

import { SignInFormModel } from '../models/sign-in-form.model';
import { AuthService } from '../../services/auth.service';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'sign-in',
  imports: [NgOptimizedImage, RouterLink, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn {
  private authService = inject(AuthService);
  private userProfileService = inject(UserProfileService);
  private router = inject(Router);

  private model = signal<SignInFormModel>({ email: '', password: '' });

  signInForm = form(this.model, (schema) => {
    required(schema.email, { message: 'Email is required' });
    email(schema.email, { message: 'Enter a valid email address' });
    required(schema.password, { message: 'Password is required' });
  });

  passwordVisible = signal(false);

  togglePasswordVisibility() {
    this.passwordVisible.update((visible) => !visible);
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    await submit(this.signInForm, async () => {
      const { email, password } = this.model();
      const success = await this.authService.signIn(email, password);

      if (success) {
        // authService writes straight to local storage and never touches this service (by
        // design), so pick up whatever it just wrote here instead.
        this.userProfileService.reload();
        await this.router.navigateByUrl('/home');
      }
    });
  }
}
