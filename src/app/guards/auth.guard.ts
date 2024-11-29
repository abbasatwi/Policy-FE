import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const snackBar = inject(MatSnackBar);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Allow access to protected routes
  }

  // Prevent redirect loop by checking if the user is already on the login page
  if (state.url !== '/login') {
    snackBar.open('You must be logged in to access this page', 'Ok', {
      duration: 3000,
    });
    router.navigate(['/login']);
  }

  return false;
};
