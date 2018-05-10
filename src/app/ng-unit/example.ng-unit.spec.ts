import {stub} from 'sinon';
import {expect, use} from 'chai';
import * as sinonChai from 'sinon-chai';
import * as chaiDom from 'chai-dom';
import {component, detectChanges, element, elements, testComponent, trigger} from 'ng-unit';
import {
  PoptartSelectorComponent,
  GreeterComponent,
  LanguageSelectorComponent,
  LanguageService,
  ParentConsumingObservableFromServiceComponent,
  ParentReceivingOutputFromChildComponent,
  ParentWithInputToChildComponent
} from '../login/examples.component';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

use(sinonChai);
use(chaiDom);

describe('ng-unit ExampleTests', () => {

  it('selects cherry', () => {
    testComponent(PoptartSelectorComponent).begin();

    trigger(element(".cherry"), 'click');
    detectChanges();

    expect(element(".message")).to.have.text("Cherry is the best!");
  });


  it('mocking children that have inputs', () => {
    const subject = testComponent(ParentWithInputToChildComponent)
      .mock([GreeterComponent])
      .begin();

    subject.boundToInput = 'foo';
    detectChanges();

    expect(component(GreeterComponent).language).to.equal('foo');
  });


  it('mocking children that have outputs', () => {
    const subject = testComponent(ParentReceivingOutputFromChildComponent)
      .mock([LanguageSelectorComponent])
      .begin();

    component(LanguageSelectorComponent).language.emit('bar');
    detectChanges();

    expect(subject.outputFromChild).to.equal('bar');
  });


  it('mocking a service that returns an observable', () => {
    const mockLanguageService = {
      getLanguages: stub().returns(Observable.of(["German", "Esperanto"]))
    };

    testComponent(ParentConsumingObservableFromServiceComponent)
      .providers([{ provide: LanguageService, useValue: mockLanguageService}])
      .begin();

    const languages = elements(".language").map(element => element.textContent);
    expect(languages).to.deep.equal(["German", "Esperanto"]);
  });


  it('mocking a service that returns an observable (subject method)', () => {
    const languageStream = new Subject<string[]>();

    const mockLanguageService = {
      getLanguages: stub().returns(languageStream)
    };

    testComponent(ParentConsumingObservableFromServiceComponent)
      .providers([{ provide: LanguageService, useValue: mockLanguageService}])
      .begin();

    expect(elements(".language")).to.have.length(0);

    languageStream.next(["German", "Esperanto"]);
    detectChanges();
    let languagesDisplayed = elements(".language").map(element => element.textContent);
    expect(languagesDisplayed).to.deep.equal(["German", "Esperanto"]);

    languageStream.next(["French"]);
    detectChanges();
    languagesDisplayed = elements(".language").map(element => element.textContent);
    expect(languagesDisplayed).to.deep.equal(["French"]);

    languageStream.complete();
  });

});
