import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Logger } from 'src/logger/logger';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  role: string | null = null;
  email: string | null = null;
  private logger = Logger;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.emailSubscription$.subscribe({
      next: (email) => {
        this.email = email;
        this.logger.info('Email subscription updated:', email);
      }
    });
  }

}
