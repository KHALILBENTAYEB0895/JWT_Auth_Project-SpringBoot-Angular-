import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

  constructor(private tokenService: TokenStorageService, private router: Router){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const token = this.tokenService.getToken();

    // list des URLs a exclure 
    const excludedUrls = ['/login', '/register'];

    // Verifie si l'URL est dans la liste d'exclusion
    const isExcluded = excludedUrls.some(url => req.url.includes(url));

    let clonedRequest = req;

    if(token && !isExcluded){
      clonedRequest = req.clone({
        headers:req.headers.set(TOKEN_HEADER_KEY , `Bearer ${token}`)
      });
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('Unauthorized! Redirecting to login...');
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          console.error('Access denied! Redirecting...');
          this.router.navigate(['/access-denied']);
        }
        return throwError(error);
      })
    );
    
  }

  
}

