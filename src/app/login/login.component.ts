import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../blog.service';
import { AuthService } from '../auth.service';
import { Logger } from 'src/logger/logger';

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
  errorMessage: string = '';

  constructor(private auth: AuthService, private router: Router) { }

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = '⚠️ Please fill all the required fields before submitting.';
      return;
    }
    this.auth.login(this.email, this.password).subscribe({
      next: (data) => {
        if (data.role === 'admin') {
          alert('Welcome Admin!');
          this.router.navigate(['/add-blog']);
        }
        if (data.role === 'user') {
          alert('Welcome User!');
          this.router.navigate(['/history']);
        }
        this.auth.setUserEmail(data.email);
        this.auth.setUserRole(data.role);
        this.auth.setUserEmailSubscription(data.email);
        this.auth.setUserRoleSubscription(data.role);
        this.logger.info('User logged in:', this.auth.getUserEmail(), 'Role:', this.auth.getUserRole());
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userEmailSubscription', data.email);
        localStorage.setItem('userRoleSubscription', data.role);



      },
      error: err => {
        if (err?.error?.message) {
          this.errorMessage = `🚫 ${err.error.message}`;
        } else {
          this.errorMessage = '🚫 Login failed due to server error.';
        }
        console.error('Login error:', err);
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

    this.auth.resetPassword(this.email, this.newPassword).subscribe({
      next: data => {
        if (data) {
          alert('Password updated. Please log in.');
          this.showForgot = false;
          this.password = '';
          this.newPassword = '';
        } else {
          alert('Email not found.');
        }

      },
      error: err => {
        if (err?.error?.message) {
          this.errorMessage = `🚫 ${err.error.message}`;
        } else {
          this.errorMessage = '🚫 Password updattion failed due to server error.';
        }
        console.error('Reset error:', err);
      }
    });


  }

}
