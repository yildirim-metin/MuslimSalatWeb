import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'prayer-time',
    loadComponent: () => import('./features/player-time/player-time').then((r) => r.PlayerTime),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((r) => r.LoginComponent),
  },
];
