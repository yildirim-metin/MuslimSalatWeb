import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '@core/enums/user-role.enum';
import { AuthService } from '@core/services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.role() === UserRole.Admin) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
