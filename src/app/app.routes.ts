import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./features/chat/home/home').then((module) => module.Home),
    canActivate: [authGuard],
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./features/auth/sign-in/sign-in').then((module) => module.SignIn),
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./features/auth/sign-up/sign-up').then((module) => module.SignUp),
  },
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: '**', redirectTo: '/home' },
];
