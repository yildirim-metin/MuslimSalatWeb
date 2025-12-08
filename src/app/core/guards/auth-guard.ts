import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Vérifie ton chemin

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si l'utilisateur est connecté (soit via Signal, soit via fonction)
  // Si ton isConnected est un signal : authService.isConnected()
  // Si c'est une méthode simple : authService.isConnected()
  // Si c'est une variable simple : authService.isConnected
  
  if (authService.isConnected()) { 
    return true; // ✅ La porte s'ouvre
  } else {
    // ⛔️ Accès refusé, on redirige vers le login
    router.navigate(['/login']);
    return false;
  }
};