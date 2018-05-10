import {Component, EventEmitter, Injectable, Input, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';


@Component({
  selector: 'greeter' ,
  template: `    
        <h1 class="message">{{selectedType}} is the best!</h1>

        <button (click)="selectType('Strawberry')" class="strawberry">Strawberry</button>
        <button  (click)="selectType('Cherry')" class="cherry">Cherry</button>
        <button  (click)="selectType('Smores')" class="smores">Smores</button>
        <button  (click)="selectType('Brown Sugar Cinnamon')" class="cinnamon">Brown Sugar Cinnamon</button>
      `
})
export class PoptartSelectorComponent {
  public selectedType = null;

  selectType(type: string) {
    return this.selectedType = type;
  }

}

//Inputs

@Component({
  selector: 'parent',
  template: `<greeter [language]="boundToInput"></greeter>`,
})
export class ParentWithInputToChildComponent {
  public boundToInput: string;
}


@Component({
  selector: 'greeter' ,
  template: `
        <div *ngIf="isEnglish()">Hello World!</div>
        <div *ngIf="!isEnglish()">Hola Mundo!</div>
      `
})
export class GreeterComponent {
  @Input() public language: string;

  isEnglish() {
    return this.language === 'English';
  }

}

///Outputs

@Component({
  selector: 'language-selector' ,
  template: `
    <button (click)="selectLanguage('English')">English</button>
    <button  (click)="selectLanguage('Spanish')">Spanish</button>
  `
})
export class LanguageSelectorComponent {
  @Output() public language = new EventEmitter<any>();

  selectLanguage(language: string) {
    this.language.emit(language);
  }

}

@Component({
  selector: 'parent',
  template: `<language-selector (language)="outputFromChild = $event"></language-selector>`,
})
export class ParentReceivingOutputFromChildComponent {
  public outputFromChild: string;
}



//Observable

@Injectable()
export class LanguageService {
  public getLanguages(): Observable<string[]> {
    return Observable.of(["English", "Spanish", "French"])
  }
}

@Component({
  selector: 'parent',
  template: `
    <ul>
      <li class="language" *ngFor="let language of languages">{{language}}</li>
    </ul>
  `,
})
export class ParentConsumingObservableFromServiceComponent {
  public languages: string[] = [];

  constructor(languageService: LanguageService) {

    languageService.getLanguages()
      .subscribe(languages => this.languages = languages);

  }
}
