import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import LoginComponent from './login/login.component';
import AuthenticationService from './login/Authentication.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    { provide: AuthenticationService, useClass: AuthenticationService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
