import {Injectable} from '@angular/core';

@Injectable()
export default class AuthenticationService {

  public authenticate(username: string, password: string): void {
    console.log(username + password);
  }

}
