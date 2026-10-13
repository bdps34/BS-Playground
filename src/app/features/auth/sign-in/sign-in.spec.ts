import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import type { Mock } from 'vitest';

import { AuthService } from '../../../core/auth/auth.service';
import { UserProfileService } from '../../../core/auth/user-profile.service';
import { SignIn } from './sign-in';

describe('SignIn', () => {
  let fixture: ComponentFixture<SignIn>;
  let element: HTMLElement;
  let authService: { signIn: Mock<AuthService['signIn']> };
  let userProfileService: UserProfileService;
  let router: Router;

  beforeEach(async () => {
    authService = { signIn: vi.fn() };

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: authService }],
    });

    router = TestBed.inject(Router);
    userProfileService = TestBed.inject(UserProfileService);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    vi.spyOn(userProfileService, 'reload');

    fixture = TestBed.createComponent(SignIn);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  function field(label: string) {
    return element.querySelector<HTMLInputElement>(`input[aria-label="${label}"]`)!;
  }

  function submitButton() {
    return element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  }

  async function fill(label: string, value: string) {
    const input = field(label);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
  }

  it('disables the submit button until the form is valid', async () => {
    expect(submitButton().disabled).toBe(true);

    await fill('Email', 'test@test.io');
    await fill('Password', 'test');

    expect(submitButton().disabled).toBe(false);
  });

  it('shows an error for an invalid email once the field is touched', async () => {
    await fill('Email', 'not-an-email');

    expect(element.querySelector('.auth-field__error')?.textContent).toContain(
      'Enter a valid email address'
    );
  });

  it('toggles password visibility', async () => {
    expect(field('Password').type).toBe('password');

    element.querySelector<HTMLButtonElement>('button[aria-label="Show password"]')!.click();
    await fixture.whenStable();

    expect(field('Password').type).toBe('text');
    expect(element.querySelector('button[aria-label="Hide password"]')).not.toBeNull();
  });

  it('signs in, reloads the profile and navigates home on success', async () => {
    authService.signIn.mockResolvedValue(true);
    await fill('Email', 'test@test.io');
    await fill('Password', 'test');

    submitButton().click();

    await vi.waitFor(() => expect(router.navigateByUrl).toHaveBeenCalledWith('/home'));
    expect(authService.signIn).toHaveBeenCalledWith('test@test.io', 'test');
    expect(userProfileService.reload).toHaveBeenCalled();
  });

  it('stays on the page when sign-in fails', async () => {
    authService.signIn.mockResolvedValue(false);
    await fill('Email', 'test@test.io');
    await fill('Password', 'wrong');

    submitButton().click();

    await vi.waitFor(() => expect(authService.signIn).toHaveBeenCalled());
    expect(userProfileService.reload).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
