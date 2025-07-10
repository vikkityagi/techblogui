import { Component } from '@angular/core';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  originalText = `Welcome to TechYatraWithVikki – a platform to explore helpful blogs about Angular, Spring Boot, and PostgreSQL in simple language.`;
  translatedText = this.originalText;
  selectedLang = 'en';

  constructor(private translator: TranslationService) { }

  // changeLang(event: Event) {
  //   const lang = (event.target as HTMLSelectElement).value;
  //   this.selectedLang = lang;

  //   if (lang !== 'en') {
  //     this.translator.translate(this.originalText, lang).subscribe(res => {
  //       this.translatedText = res.data.translations[0].translatedText;
  //     });
  //   } else {
  //     this.translatedText = this.originalText;
  //   }
  // }
  changeLang(event: any) {
    const targetLang = event.target.value;

    this.translator.translate(this.originalText, targetLang).subscribe(
      (res: any) => {
        this.translatedText = res;
      },
      (err) => {
        console.error('Translation error:', err);
        alert('Translation failed.');
      }
    );
  }

}
