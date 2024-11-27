import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:8080';

  constructor( private httpClient: HttpClient, private router: Router){}

  login(username: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/login` , {
      username,
      password
    })
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

  // saveToken(token: string){
  //   localStorage.setItem('token', token);
  // }

  // getToken():string | null{
  //   return localStorage.getItem('token')
  // }

  // logout(): void{
  //   localStorage.removeItem('token');
  //   this.router.navigate(['/login']);
  // }
  
}
