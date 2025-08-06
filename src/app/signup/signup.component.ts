import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { Logger } from 'src/logger/logger';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  email = '';
  password = '';
  role: 'user' | 'admin' = 'user';
  loading = false;

  errorMessages: string[] = [];
  emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  hidePassword: boolean = true; // 👈 toggle flag
  passwordPattern: RegExp = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;
  private logger = Logger; // Replace with your logging service


  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  handleStorageChange(event: StorageEvent) {
    const keysToWatch = ['userEmail', 'userRole', 'userEmailSubscription', 'userRoleSubscription'];

    if (event.newValue === null && keysToWatch.includes(event.key!)) {
      this.auth.logout();

    }
  }

  signup() {
    if (!this.email || !this.password || !this.role) {
      this.errorMessages.push('⚠️ Please fill all the required fields before submitting.');
      return;
    }else{
      this.errorMessages = []; // Clear previous errors
    }
    if (!this.emailPattern.test(this.email)) {
      this.errorMessages.push(' Please enter a valid email address.');
      return;
    }else{
      this.errorMessages = []; // Clear previous errors
    }

    if (!this.passwordPattern.test(this.password)) {
      this.errorMessages.push(
        '🔒 Password must be at least 6 characters long and include one capital letter, one number, and one special character.'
      );
      return;
    }else{
      this.errorMessages = []; // Clear previous errors
    }

    this.loading = true;

    // You can add more validation here (e.g. email format, password strength)

    // Clear error if validation passes
    const hashedPassword = CryptoJS.SHA256(this.password).toString();  // or use MD5, SHA512
    // const hashedPassword = Crypto.SHA256(this.password).toString();  // or use MD5, SHA512
    this.auth.register({ email: this.email, password: hashedPassword, role: this.role }).subscribe({
      next: (data) => {
        const body = data.body;
        this.logger.info('Signup response:', body);
        if (!body || data.status !== 201) {
          this.errorMessages.push('Signup failed. Please try again.');
        } else if (body && data.status === 201) {
          this.logger.log('Signup successful:', data);
          alert('Signup successful! Please log in.');
          this.loading = false;
          this.router.navigate(['/login']);
        }else{
          this.errorMessages = [];
        }

      },
      error: err => {

        if (err.status === 500 && err?.error?.errorMessage) {
          setTimeout(() => {
            this.errorMessages = [];
          }, 6000);
          this.errorMessages.push(`${err.error.errorMessage}`);
        } else if (err.status === 400 && err?.error?.errors) {
          const messages = err.error.errors.map((e: any) => e.defaultMessage);
          setTimeout(() => {
            this.errorMessages = [];
          }, 6000);
          this.errorMessages.push(` ${messages.join(', ')}`);
        }
        else {
          setTimeout(() => {
            this.errorMessages = [];
          }, 6000);
          this.errorMessages.push('Signup failed due to server error.');
        }
        this.logger.error('Signup error:', err);
        this.loading = false;
      }
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
