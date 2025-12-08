import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard'; 
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
    canActivate: [authGuard], 
  },
];