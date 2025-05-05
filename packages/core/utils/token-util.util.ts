import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenUtil {
  constructor(private http: HttpClient) {}

  public static isTokenExpired(token: string): boolean {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded?.exp !== undefined ? decoded.exp * 1000 < Date.now() : false;
  }
}
