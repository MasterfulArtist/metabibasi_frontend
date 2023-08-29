import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {StorageService} from "./storage.service";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {
  }


  canActivate(): boolean {
    if (this.storageService.isLoggedIn()) {
      return true;

    } else {
      this.router.navigate(['']);
      return false;
    }
  }

}

@Injectable()
export class CanActivateAdmin implements CanActivate {

  constructor(private storageService: StorageService, private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const userToken = this.storageService.getUser();
    if (userToken.roles[0] === 'ROLE_ADMIN') {
      return true;
    }

    this.authService.logout();
    return false;
  }

}

@Injectable()
export class CanActivateUser implements CanActivate {

  constructor(private authService: AuthService, private storageService: StorageService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const userToken = this.storageService.getUser();
    if (userToken.roles[0] === 'ROLE_AGORASTIS' || userToken.roles[0] === 'ROLE_POLITIS' || userToken.roles[0] === 'ROLE_ADMIN') {
      return true;
    }

    this.authService.logout();
    return false;
  }

}
