import LoginComponent from '../login/login.component';
import AuthenticationService from '../login/Authentication.service';
import {stub} from 'sinon';
import {expect, use} from 'chai';
import * as sinonChai from 'sinon-chai';
import * as chaiDom from 'chai-dom';
import {FormsModule} from '@angular/forms';
import {element, testComponent, setInputValue, trigger} from 'ng-unit';

use(sinonChai);
use(chaiDom);

describe('AppComponent', () => {
  let subject: LoginComponent, mockAuthenticationService: any;

  beforeEach(() => {
    mockAuthenticationService = {
      authenticate: stub()
    };

    subject = testComponent(LoginComponent)
      .import([FormsModule])
      .providers([{ provide: AuthenticationService, useValue: mockAuthenticationService }])
      .begin();
  });

  it('should allow logging in', () => {
    setInputValue(element('.username'), 'jdoe');
    setInputValue(element('.password'), 'p@ssw0rd');
    trigger(element('.login'), 'click');

    expect(mockAuthenticationService.authenticate).to.have.been.calledWith('jdoe', 'p@ssw0rd');
  });

});
