// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let isLoggedIn = false;
  if (localStorage.getItem('userEmail') != null && localStorage.getItem('userRole') != null && localStorage.getItem('userEmailSubscription') != null && localStorage.getItem('userRoleSubscription')!= null) {
    isLoggedIn = localStorage.getItem('userEmail') !== null; // or any auth check
    authService.setUserEmail(localStorage.getItem('userEmail')!);
    const role = localStorage.getItem('userRole');
    if (role === 'admin' || role === 'user') {
      authService.setUserRole(role);
    }
    authService.setUserEmailSubscription(localStorage.getItem('userEmailSubscription')!);
    authService.setUserRoleSubscription(localStorage.getItem('userRoleSubscription')!);
  } else {
    // Check if user is logged in via AuthService
    isLoggedIn = !!authService.getUserEmail();
  }

  if (isLoggedIn) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
