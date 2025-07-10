import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Logger } from 'src/logger/logger';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  role: string | null = null;
  email: string | null = null;
  private logger = Logger;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {

    // Subscribe to email changes
    this.auth.emailSubscription$.subscribe({
      next: (email) => {
        this.email = email;
        this.logger.info('User email updated:', this.email);
      },
      error: (err) => {
        this.logger.error('Error fetching user email:', err);
      }
    });

    // Subscribe to role changes
    this.auth.roleSubscription$.subscribe({
      next: (role) => {
        this.role = role;
        this.logger.info('User role updated:', this.role);
      },
      error: (err) => {
        this.logger.error('Error fetching user role:', err);
      }
    });

  }



  getUserRole(): string | null {
    return this.role;
  }


  logout(): void {
    let isconfirm = confirm("Are you sure you want to logout?");
    if (!isconfirm) return;
    this.logger.info('Logging out user:', this.email);
    this.auth.logout();
  }
}
