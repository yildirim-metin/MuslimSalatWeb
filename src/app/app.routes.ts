import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'prayer-time',
    loadComponent: () => import('./features/prayer-time/prayer-time').then((r) => r.PrayerTime),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((r) => r.LoginComponent),
  },
];
