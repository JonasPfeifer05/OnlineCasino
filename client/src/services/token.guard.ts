import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {NetworkingService} from "./networking.service";

@Injectable({
    providedIn: 'root'
})
export class TokenGuard implements CanActivate {

    constructor(private networking: NetworkingService, private router: Router) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean> {
        return this.networking.checkTokens().then(value => {
            if (!value) this.router.navigate(["login"]);

            return value;
        });
    }

}
