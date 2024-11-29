import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip adding the Authorization header for login and register
  if (req.url.includes('/login') || req.url.includes('/register')) {
    return next(req);
  }

  const token = authService.getToken();
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(cloned);
  }

  return next(req); // Pass the request as-is if no token is present
};

