import { TokenStorageService } from './../services/token-storage.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.tokenStorageService.getToken();
    const role = localStorage.getItem('role'); // récupérer le rôle

    if(!token){
      // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
      this.router.navigate(['/login']);
      return false; 
    }

    const expectedRole = route.data['role']; // Rôle attendu pour cette route

    if (role === expectedRole) {
      // Autoriser l'accès si le rôle correspond
      return true;
    }

    // Rediriger vers la page de connexion si non autorisé
    this.router.navigate(['/login']);
    return false;
  }
}
