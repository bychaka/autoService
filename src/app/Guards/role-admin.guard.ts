import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {LoginService} from "../login/login.service";

@Injectable({
  providedIn: 'root'
})
export class RoleAdminGuard implements CanActivate {
  constructor(
    public loginService: LoginService,
    public router: Router
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.loginService.isRoleAdmin !== true) {
      window.alert("ADMIN not allowed!");
      this.router.navigate(['/access-denied'])
    }
    return true;
  }

}
