import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'prayer-time',
    loadComponent: () => import('./features/player-time/player-time').then((r) => r.PlayerTime),
  },
];
