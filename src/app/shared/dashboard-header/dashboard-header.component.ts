import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../login/login.service";

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {
  userName: string;
  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.userName = this.loginService.loggedUser.name;
  }

  logOut(){
    this.loginService.logout();
  }

}
