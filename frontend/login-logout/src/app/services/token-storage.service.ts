import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class TokenStorageService {

private TOKEN_KEY = 'token';


  constructor() { }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }


  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
