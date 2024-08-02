import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const localData = localStorage.getItem('angular17token');
    if (localData != null) {
      return true;
    } else {
      router.navigateByUrl('/login');
      return false;
    }
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
