import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const tk = authService.token();

  if (tk) {
    const cloneReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${tk}`),
    });
    return next(cloneReq);
  }

  return next(req);
};
