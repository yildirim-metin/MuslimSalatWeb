import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '@core/enums/user-role.enum';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.role() === UserRole.Admin) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
