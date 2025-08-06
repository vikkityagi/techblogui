import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../blog.service';
import { AuthService } from '../auth.service';
import { Logger } from 'src/logger/logger';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  newPassword = '';
  showForgot = false;
  private logger = Logger;
  hidePassword: boolean = true; // 👈 toggle flag
  errorMessage: string[] = [];
  loading = false;


  constructor(private auth: AuthService, private router: Router) { }

  login() {
    if (!this.email || !this.password) {
      this.errorMessage.push('⚠️ Please fill all the required fields before submitting.');
      return;
    }
    this.loading = true;
    const hashedPassword = CryptoJS.SHA256(this.password).toString();
    this.auth.login(this.email, hashedPassword).subscribe({
      next: (data) => {
        const body = data.body;
        if (!body || !body.email || !body.role) {
          this.errorMessage.push('⚠️ Invalid response from server.');
          this.loading = false;
          return;
        }
        this.logger.info('Login successful:', body);
        this.logger.info('User email:', body.email, 'Role:', body.role);
        if (body.role === 'admin' && data.status === 200) {
          alert('Welcome Admin!');
          this.router.navigate(['/add-blog']);
        }
        if (body.role === 'user') {
          alert('Welcome User!');
          this.router.navigate(['/history']);
        }
        this.auth.setUserEmail(body.email);
        this.auth.setUserRole(body.role);
        this.auth.setUserEmailSubscription(body.email);
        this.auth.setUserRoleSubscription(body.role);
        this.logger.info('User logged in:', this.auth.getUserEmail(), 'Role:', this.auth.getUserRole());
        localStorage.setItem('userEmail', body.email);
        localStorage.setItem('userRole', body.role);
        localStorage.setItem('userEmailSubscription', body.email);
        localStorage.setItem('userRoleSubscription', body.role);

        this.loading = false;

      },
      error: err => {
        if (err.status === 500 && err?.error?.errorMessage) {
          setTimeout(() => {
            this.errorMessage = [];
          }, 6000);
          this.errorMessage.push(`${err.error.errorMessage}`);
        } else if (err.status === 400 && err?.error?.errorMessage) {
          setTimeout(() => {
            this.errorMessage = [];
          }, 6000);
          this.errorMessage.push(err.error.errorMessage);
          // this.errorMessage.push(` ${messages.join(', ')}`);
        }
        else {
          setTimeout(() => {
            this.errorMessage = [];
          }, 6000);
          this.errorMessage.push('Login failed due to server error.');
        }
        this.logger.error('Login error:', err);
        this.loading = false;
        this.email = '';
        this.password = '';
      }
    });



  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }



  toggleForgot() {
    this.showForgot = !this.showForgot;
  }

  resetPassword() {
    if (!this.email || !this.newPassword) {
      alert('Please fill email and new password.');
      return;
    }

    this.loading = true;

    const hashedPassword = CryptoJS.SHA256(this.newPassword).toString();
    this.auth.resetPassword(this.email, hashedPassword).subscribe({
      next: data => {
        if (data) {
          alert('Password updated. Please log in.');
          this.showForgot = false;
          this.password = '';
          this.newPassword = '';
        } else {
          alert('Email not found.');
        }
        this.loading = false;
      },
      error: err => {
        if (err?.error?.message) {
          setTimeout(() => {
            this.errorMessage = [];
          }, 6000);
          this.errorMessage.push(`🚫 ${err.error.message}`);
        } else {
          setTimeout(() => {
            this.errorMessage = [];
          }, 6000);
          this.errorMessage.push('🚫 Password update failed due to server error.');
        }
        console.error('Reset error:', err);
        this.loading = false;
      }
    });


  }

}
