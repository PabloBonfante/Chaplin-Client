import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './Service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        //Obtener la ruta actual
        let currentUrl = state.url;
        let isLogged = this.authService.isLoggedIn();
        let IsAutorizated = true;

        if (!isLogged && currentUrl !== '/login') {
            return this.router.createUrlTree(['/login']);
        }

        if (!IsAutorizated && currentUrl !== '/unauthorized') {
            return this.router.createUrlTree(['/unauthorized']);
        }

        return true;

        // if (this.authService.isLoggedIn()) {
        //   return true;
        // } else {
        //   return this.router.createUrlTree(['/login']);
        // }
    }
}