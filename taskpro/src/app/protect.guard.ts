import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';



export const protectGuard: CanActivateFn = () => {
  const http = inject(HttpClient);
  const router = inject(Router);

  return http.get('http://localhost:3030/users', {
    withCredentials: true
  }).pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};