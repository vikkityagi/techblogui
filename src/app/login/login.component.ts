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

  constructor(private auth: AuthService, private router: Router) { }

  login() {
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



      },
      error: err => {
        alert('Login failed. Please check your credentials.');
        this.logger.error(err);
      }
    });



  }

  

  toggleForgot() {
    this.showForgot = !this.showForgot;
  }

  resetPassword() {
    if (!this.email || !this.newPassword) {
      alert('Please fill email and new password.');
      return;
    }

    const success = this.auth.resetPassword(this.email, this.newPassword);
    if (success) {
      alert('Password updated. Please log in.');
      this.showForgot = false;
      this.password = '';
    } else {
      alert('Email not found.');
    }
  }

}
