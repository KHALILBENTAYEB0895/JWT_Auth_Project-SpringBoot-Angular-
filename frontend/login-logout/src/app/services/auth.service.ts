import { TokenStorageService } from './token-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:8080';

  constructor( private httpClient: HttpClient, private router: Router, private tokenStorageService: TokenStorageService){}

  login(username: string, password: string): Observable<_AuthResponse> {
    return this.httpClient.post<_AuthResponse>(`${this.apiUrl}/login` , {username,password})
    .pipe(
      tap((response) => {
        // save token and role in localeStorage
        this.tokenStorageService.saveToken(response.access_token);
        // save the Role
        localStorage.setItem('role', response.role);
      })
    );
  }

  register(firstName: string, lastName: string, username: string, password: string, role: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/register`, {
      firstName,
      lastName,
      username,
      password,
      role, 
    });
  }
  
}

interface _AuthResponse{
  access_token: string;
  refresh_token: string;
  role: string;
  message: string;
}
