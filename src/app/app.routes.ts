import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'prayer-time',
    loadComponent: () => import('./features/prayer-time/prayer-time').then((r) => r.PrayerTime),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login-page/login-page').then((r) => r.LoginPage),
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/register-page/register-page').then((r) => r.RegisterPage),
  },
];
