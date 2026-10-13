import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import type { Mock } from 'vitest';

import { AuthService } from '../../../core/auth/auth.service';
import { SignUp } from './sign-up';

describe('SignUp', () => {
  let fixture: ComponentFixture<SignUp>;
  let element: HTMLElement;
  let authService: { createUser: Mock<AuthService['createUser']> };
  let router: Router;

  beforeEach(async () => {
    authService = { createUser: vi.fn() };

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: authService }],
    });

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture = TestBed.createComponent(SignUp);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  function submitButton() {
    return element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  }

  async function fill(label: string, value: string) {
    const input = element.querySelector<HTMLInputElement>(`input[aria-label="${label}"]`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
  }

  it('shows an error and stays invalid when the passwords do not match', async () => {
    await fill('Email', 'new@test.io');
    await fill('Password', 'secret-1');
    await fill('Confirm password', 'secret-2');

    expect(element.querySelector('.auth-field__error')?.textContent).toContain(
      'Passwords do not match'
    );
    expect(submitButton().disabled).toBe(true);
  });

  it('creates the account and navigates home when the form is valid', async () => {
    authService.createUser.mockResolvedValue(true);
    await fill('Email', 'new@test.io');
    await fill('Password', 'secret-1');
    await fill('Confirm password', 'secret-1');

    expect(submitButton().disabled).toBe(false);
    submitButton().click();

    await vi.waitFor(() => expect(router.navigateByUrl).toHaveBeenCalledWith('/home'));
    expect(authService.createUser).toHaveBeenCalledWith('new@test.io', 'secret-1');
  });
});
