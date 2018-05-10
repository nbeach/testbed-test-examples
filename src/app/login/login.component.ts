import {Component} from '@angular/core';
import AuthenticationService from './Authentication.service';

@Component({
  selector: 'login',
  template: `
    <h1>Login</h1>
    Username: <input type="text" class="username" [(ngModel)]="user">
    Password: <input type="password" class="password" [(ngModel)]="password">
    <button class="login" (click)="login()"></button>
  `
})
export default class LoginComponent {
  public user: string;
  public password: string;

  constructor(private authService: AuthenticationService) { }

  login() {
    this.authService.authenticate(this.user, this.password);
  }
}
