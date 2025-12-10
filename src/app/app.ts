import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@core/enums/user-role.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  isMenuOpen = signal(false);

  isConnected = this._authService.isConnected;

  isAdmin = computed(() => this._authService.role() === UserRole.Admin);

  toggleMenu(): void {
    this.isMenuOpen.update((val) => !val);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  logout(): void {
    this.closeMenu();
    this._authService.logout();
    this._router.navigate(['/home']);
  }
}
