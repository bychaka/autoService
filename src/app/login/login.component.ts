import { Component, OnInit } from '@angular/core';
import {LoginService} from "./login.service";
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from "@angular/router";
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLogin = true;
  loginError = false;

  constructor(private loginService: LoginService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: ['']
    });
    this.registerForm = this.formBuilder.group({
      name: [''],
      email: [''],
      password: ['']
    });

    if (this.loginService.isLoggedIn) {
      this.router.navigate(this.loginService.isRoleAdmin ? ['admin'] : [`user/${this.loginService.loggedUser._id}`]);
    }

  }


  get isLoginForm() {
    return this.isLogin;
  }

  tabClick(e, target) {
    this.loginError = false;
    this.isLogin = target === '#login';
    $(e.target).fadeIn(600);
  }

  get errorField() {
    return this.loginForm.controls.email.status === 'INVALID' || this.loginError ? 'inavlid-field' : '';
  }

  loginUser() {
    if (this.loginForm.status === 'VALID') {
      this.loginError = false;
      this.loginService.login(this.loginForm.value).then(user => {
        this.router.navigate(this.loginService.isRoleAdmin ? ['admin'] : [`user/${user._id}`]);
      }, error => {
        this.loginError = true;
        console.error(error);
      })
    }
  }

  registerUser() {
    if (this.registerForm.status === 'VALID') {
      this.loginError = false;
      this.loginService.register(this.registerForm.value).then(user => {
        this.router.navigate([`user/${user._id}`]);
      }, error => {
        this.loginError = true;
        console.error(error);
      })
    }
  }

}
