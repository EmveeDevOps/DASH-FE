import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenUtil } from '../utils/token-util.util';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token && !TokenUtil.isTokenExpired(token)) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
