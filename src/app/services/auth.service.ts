import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../core/environment';

const TOKEN_KEY = 'bw_admin_token';
const ADMIN_EMAIL_KEY = 'bw_admin_email';
const ADMIN_ROLE_KEY = 'bw_admin_role';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  email: string;
  role: string;
  expiresAt: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  userType: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl + '/Admin';

  constructor(private http: HttpClient) {}

  login(req: AdminLoginRequest): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.apiUrl}/login`, req).pipe(
      tap((res) => {
        this.setSession(res);
      })
    );
  }

  private setSession(res: AdminLoginResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(ADMIN_EMAIL_KEY, res.email);
    localStorage.setItem(ADMIN_ROLE_KEY, res.role);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_EMAIL_KEY);
    localStorage.removeItem(ADMIN_ROLE_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getAdminEmail(): string | null {
    return localStorage.getItem(ADMIN_EMAIL_KEY);
  }

  getAdminRole(): string | null {
    return localStorage.getItem(ADMIN_ROLE_KEY);
  }

  isAdminLoggedIn(): boolean {
    return !!this.getToken();
  }

  private authHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, {
      headers: this.authHeaders(),
    });
  }

  getMe(): Observable<{ email: string; role: string }> {
    return this.http.get<{ email: string; role: string }>(`${this.apiUrl}/me`, {
      headers: this.authHeaders(),
    });
  }
}
