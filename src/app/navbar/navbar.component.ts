import { Component, EventEmitter, HostListener, Output } from '@angular/core';
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

  isMenuOpen = false;
  isDesktop = window.innerWidth > 768;

  // dropdown toggle
  dropdownOpen = false;

  @HostListener('window:resize')
  onResize() {
    this.isDesktop = window.innerWidth > 768;
    if (this.isDesktop) {
      this.isMenuOpen = false; // Reset menu state on large screen
    }
  }

  closeMenu() {
    if (!this.isDesktop) {
      this.isMenuOpen = false;
    }
  }

  // test() {
  //   this.logger.info('Test function called');
  //   this.auth.getJsonWebToken().subscribe({
  //     next: (response:any) => {
  //       this.logger.info('Response from getJsonWebToken:', response);

  //     },error: (err) => {
  //       this.logger.error('Error fetching user token:', err);
  //     }
  //   })
  // }


  constructor(private auth: AuthService) { }

  ngOnInit(): void {

    // Subscribe to email changes
    this.auth.emailSubscription$.subscribe({
      next: (email) => {
        if (email !== null)
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
        if (role != null)
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

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }


  logout(): void {
    // if(!this.email) {
    let isconfirm = confirm("Are you sure you want to logout?");
    if (!isconfirm) return;
    this.logger.info('Logging out user:', this.email);
    this.auth.logout();
  }

}
