import {stub} from 'sinon';
import {TestBed} from '@angular/core/testing';
import {expect, use} from 'chai';
import * as sinonChai from 'sinon-chai';
import * as chaiDom from 'chai-dom';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {By} from '@angular/platform-browser';
import {
  PoptartSelectorComponent, LanguageService,
  ParentConsumingObservableFromServiceComponent,
  ParentReceivingOutputFromChildComponent,
  ParentWithInputToChildComponent
} from './examples.component';
import {Observable} from 'rxjs/Observable';
import "core-js/es7/reflect"
import {Subject} from 'rxjs/Subject';

use(sinonChai);
use(chaiDom);

describe('ExampleTests', () => {

  it('selects cherry', () => {
    TestBed.configureTestingModule({
      declarations: [PoptartSelectorComponent],
    });

    const fixture = TestBed.createComponent(PoptartSelectorComponent);
    const subjectElement = fixture.nativeElement;
    fixture.detectChanges();


    subjectElement.querySelector(".cherry").dispatchEvent(new Event("click"));
    fixture.detectChanges();

    expect(subjectElement.querySelector(".message").textContent).to.equal("Cherry is the best!");
  });


  it('mocking children that have inputs', () => {

    @Component({
      selector: 'greeter',
      template: ''
    })
    class MockGreeterComponent {
      @Input() private language: string;
    }

    TestBed.configureTestingModule({
      declarations: [ParentWithInputToChildComponent, MockGreeterComponent],
    });

    const fixture = TestBed.createComponent(ParentWithInputToChildComponent);
    const subject = fixture.componentInstance;
    fixture.detectChanges();

    subject.boundToInput = 'Spanish';
    fixture.detectChanges();

    const component = fixture.debugElement.query(By.css('greeter')).componentInstance;
    expect(component.language).to.equal('Spanish');
  });


  it('mocking children that have outputs', () => {
    @Component({
      selector: 'language-selector' ,
      template: ''
    })
    class MockLanguageSelectorComponent {
      @Output() private language = new EventEmitter<any>();
    }

    TestBed.configureTestingModule({
      declarations: [ParentReceivingOutputFromChildComponent, MockLanguageSelectorComponent],
    });

    const fixture = TestBed.createComponent(ParentReceivingOutputFromChildComponent);
    const subject = fixture.componentInstance;
    fixture.detectChanges();

    const component = fixture.debugElement.query(By.css('language-selector')).componentInstance;
    component.language.emit('bar');
    fixture.detectChanges();
    expect(subject.outputFromChild).to.equal('bar');
  });


  it('mocking a service that returns an observable', () => {
    const mockLanguageService = {
      getLanguages: stub().returns(Observable.of(["German", "Esperanto"]))
    };

    TestBed.configureTestingModule({
      declarations: [ParentConsumingObservableFromServiceComponent],
      providers: [{ provide: LanguageService, useValue: mockLanguageService}]
    });

    const fixture = TestBed.createComponent(ParentConsumingObservableFromServiceComponent);
    const subjectElement = fixture.nativeElement;
    fixture.detectChanges();

    const languages = subjectElement.querySelectorAll(".language");
    expect(languages).to.have.length(2);
    expect(languages[0].textContent).to.equal("German");
    expect(languages[1].textContent).to.equal("Esperanto");
  });

  it('mocking a service that returns an observable (subject method)', () => {
    const languageStream = new Subject<string[]>();

    const mockLanguageService = {
      getLanguages: stub().returns(languageStream)
    };

    TestBed.configureTestingModule({
      declarations: [ParentConsumingObservableFromServiceComponent],
      providers: [{ provide: LanguageService, useValue: mockLanguageService}]
    });

    const fixture = TestBed.createComponent(ParentConsumingObservableFromServiceComponent);
    const subjectElement = fixture.nativeElement;
    fixture.detectChanges();


    let languagesDisplayed = subjectElement.querySelectorAll(".language");
    expect(languagesDisplayed).to.have.length(0);


    languageStream.next(["German", "Esperanto"]);
    fixture.detectChanges();
    languagesDisplayed = subjectElement.querySelectorAll(".language");
    expect(languagesDisplayed).to.have.length(2);
    expect(languagesDisplayed[0].textContent).to.equal("German");
    expect(languagesDisplayed[1].textContent).to.equal("Esperanto");


    languageStream.next(["French"]);
    fixture.detectChanges();
    languagesDisplayed = subjectElement.querySelectorAll(".language");
    expect(languagesDisplayed).to.have.length(1);
    expect(languagesDisplayed[0].textContent).to.equal("French");

    languageStream.complete();
  });

});
