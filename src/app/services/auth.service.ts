import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { UserDetails } from '../interfaces/user-details';
import { RegisterRequest } from '../interfaces/register-request';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = environment.apiUrl;
  private tokenKey = 'token';
  private isBrowser: boolean;
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object, private http: HttpClient, private router:Router) {
    // Check if the code is running in the browser in order to set the token into the local storage
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isLoggedIn()) {
      this.loggedInSubject.next(true);
    }
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}account/login`, data)
      .pipe(
        map((response) => {
          // Check if the code is running in the browser in order to set the token into the local storage
          if (response.isSuccess && this.isBrowser) {
            localStorage.setItem(this.tokenKey, response.token);
            this.loggedInSubject.next(true);
          }
          return response;
        })
      );
  }

    // Register Function
    register(data: RegisterRequest): Observable<AuthResponse> {
      return this.http.post<AuthResponse>(`${this.apiUrl}account/register`, data).pipe(
        map((response) => {
          if (response.isSuccess && this.isBrowser) {
            // Optionally handle any logic post-registration
            this.router.navigate(['/login']);
          }
          return response;
        })
      );
    }

  getUserDetail = () => {
    if (!this.isBrowser) return null;

    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    const userDetail : UserDetails | undefined = {
      id: decodedToken.nameid,
      fullName: decodedToken.name,
      email: decodedToken.email,
      roles: decodedToken.role || [],
    };

    return userDetail;
  };

  isLoggedIn = (): boolean => {
    if (!this.isBrowser) return false;

    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired();
  };

  private isTokenExpired() {
    if (!this.isBrowser) return true;

    const token = this.getToken();
    if (!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
    if (isTokenExpired) this.logout();
    return isTokenExpired;
  }

  logout = (): void => {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      this.loggedInSubject.next(false);
    }
  };

   public getToken = (): string | null =>
    this.isBrowser ? localStorage.getItem(this.tokenKey) || '' : null;
}
