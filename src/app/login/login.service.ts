import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  API_URL: string = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) { }

  login(user: any): Promise<any> {
    return this.http
      .post(`${this.API_URL}/api/login`, user)
      .toPromise()
      .then(response => {
        console.log(response);
        this.setLoginRole(response);
        return response;
      }, error => Promise.reject(error));
  }

  register(user: any): Promise<any> {
    return this.http
      .post(`${this.API_URL}/api/register`, user)
      .toPromise()
      .then(response => {
        this.setLoginRole(response);
        return response;
      }, error => Promise.reject(error));
  }

  setLoginRole(user) {
    localStorage.setItem('_id', user._id);
    localStorage.setItem('name', user.name);
    localStorage.setItem('email', user.email);
    localStorage.setItem('role', user.role);
  }

  logout() {
    if (localStorage.removeItem('_id') == null && localStorage.removeItem('role') == null) {
      this.router.navigate(['/login']);
    }
  }
  get isLoggedIn(): boolean {
    let id = localStorage.getItem('_id');
    let role = localStorage.getItem('role');

    return (id !== null && role !== null);
  }

  get loggedUser() {
    let storageUserData = {
      _id: localStorage.getItem('_id'),
      name: localStorage.getItem('name'),
      email: localStorage.getItem('email'),
      role: localStorage.getItem('role')
    };
    return storageUserData;
  }

  get isRoleAdmin(): boolean {
    let role = localStorage.getItem('role');

    return (role === 'ADMIN');
  }
}
