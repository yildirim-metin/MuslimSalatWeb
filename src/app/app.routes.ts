import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from '@core/guards/admin-guard';
export const routes: Routes = [
  {
    path: 'prayer-time',
    loadComponent: () => import('./features/prayer-time/prayer-time').then((r) => r.PrayerTime),
    canActivate: [authGuard],
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
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/Dashboard/dashboard/dashboard').then((r) => r.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home-page/home-page').then((r) => r.HomePage),
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin').then((r) => r.Admin),
    canActivate: [adminGuard],
  },
  {
    path: 'event',
    loadComponent: () => import('./features/event-page/event-page').then((r) => r.EventPage),
    canActivate: [authGuard],
  },
];
