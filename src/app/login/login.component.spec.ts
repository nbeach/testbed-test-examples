import LoginComponent from './login.component';
import AuthenticationService from './Authentication.service';
import {stub} from 'sinon';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {expect, use} from 'chai';
import * as sinonChai from 'sinon-chai';
import * as chaiDom from 'chai-dom';
import {FormsModule} from '@angular/forms';

use(sinonChai);
use(chaiDom);

describe('AppComponent', () => {

  let fixture: ComponentFixture<LoginComponent>, mockAuthenticationService: any;

  beforeEach(() => {
    mockAuthenticationService = {
      authenticate: stub()
    };

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthenticationService }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });

  it('should allow logging in', () => {

    const usernameField = fixture.nativeElement.querySelector('.username');
    usernameField.value = 'jdoe';
    usernameField.dispatchEvent(new Event('input'));
    usernameField.dispatchEvent(new Event('change'));

    const passwordField = fixture.nativeElement.querySelector('.password');
    passwordField.value = 'p@ssw0rd';
    passwordField.dispatchEvent(new Event('input'));
    passwordField.dispatchEvent(new Event('change'));

    fixture.nativeElement.querySelector('.login').dispatchEvent(new Event('click'));

    expect(mockAuthenticationService.authenticate).to.have.been.calledWith('jdoe', 'p@ssw0rd');
  });

});
