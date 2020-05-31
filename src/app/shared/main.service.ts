import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class MainService {
  API_URL: string = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) { }

  sendComment(comment: any): Promise<any> {
    return this.http
      .post(`${this.API_URL}/api/comments`, comment)
      .toPromise()
      .then(response => {
        return response;
      }, error => Promise.reject(error));

  }
  getComments(userId?:any): Promise<any> {
    const url = userId ? `${this.API_URL}/api/comments?id=${userId}` : `${this.API_URL}/api/comments`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => {
        return response;
      }, error => Promise.reject(error));
  }
  saveOrder(order: any): Promise<any> {
    return this.http
      .post(`${this.API_URL}/api/order`, order)
      .toPromise()
      .then(response => {
        return response;
      }, error => Promise.reject(error));

  }
  getOrders(email?:any): Promise<any> {
    const url = email ? `${this.API_URL}/api/orders?email=${email}` : `${this.API_URL}/api/orders`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => {
        return response;
      }, error => Promise.reject(error));
  }
}
