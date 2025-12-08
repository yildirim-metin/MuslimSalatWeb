import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  // J'ai ajouté RouterLinkActive ici pour que le style .active fonctionne
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Signal pour gérer l'ouverture/fermeture du menu profil
  isMenuOpen = signal(false);

  // Ton signal d'authentification existant
  isConnected = this.authService.isConnected;

  /**
   * Ouvre ou ferme le menu déroulant du profil
   */
  toggleMenu(): void {
    this.isMenuOpen.update((val) => !val);
  }

  /**
   * Ferme le menu (utilisé quand on clique ailleurs ou après une action)
   */
  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  logout(): void {
    this.closeMenu(); // On ferme le menu visuellement
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
