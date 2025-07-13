import { Component } from '@angular/core';
import { TranslationService } from '../translation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  originalText = `Welcome to TechYatraWithVikki – a platform to explore helpful blogs about Angular, Spring Boot, and PostgreSQL in simple language.`;
  translatedText = this.originalText;
  selectedLang = 'en';

  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'hi']);
    translate.setDefaultLang('en');
  }

  onLanguageChange(event: Event): void {
    const selectedLang = (event.target as HTMLSelectElement).value;
    this.translate.use(selectedLang);
  }

}
