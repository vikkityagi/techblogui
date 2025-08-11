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
  emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  passwordPattern: RegExp = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;

  // otp

  otpSent: boolean = false;
  otpReference: any;
  otpVerified: boolean = false;
  otp: string = '';
  otpMessage: any;

  isError: boolean = false;
  otpExpireTime: number = 0;
  timeLeftMs: number = 0; // time left in milliseconds
  displayTime: string = '';
  private timer: any;

  // forgot password
  // forgotPassword: boolean = true;


  constructor(private auth: AuthService, private router: Router) { 

    
  }

  login() {
    this.otpSent = false;
    this.loading = false;
    if (!this.email || !this.password) {
      this.errorMessage.push('⚠️ Please fill all the required fields before submitting.');
      return;
    }

    if (!this.emailPattern.test(this.email)) {
      this.errorMessage.push(' Please enter a valid email address.');
      return;
    } else {
      this.errorMessage = []; // Clear previous errors
    }

    if (!this.passwordPattern.test(this.password)) {
      this.errorMessage.push(
        '🔒 Password must be at least 6 characters long and include one capital letter, one number, and one special character.'
      );
      return;
    } else {
      this.errorMessage = []; // Clear previous errors
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
        if (body.role && data.status === 200 && body.isVerify && body.otpExpirationTime && body.otpReference) {
          this.otpSent = true;
          this.otpReference = body.otpReference;
          this.otpExpireTime = body.otpExpirationTime;
          this.startCountdown();

          // alert('Welcome Admin!');
          // this.router.navigate(['/add-blog']);
        }


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

  verifyOtp() {
    this.auth.verifyOtp({ email: this.email, otp: this.otp, otpReference: this.otpReference }).subscribe({
      next: (res) => {
        const body = res.body;
        if (body && body.isVerify && body.role) {
          this.otpVerified = true;
          setTimeout(() => {

            this.otpMessage = '';
          }, 3000);
          this.otpMessage = body.message;
          this.otpVerified = true;
          if (body.role === 'user' && body.isVerify && body.email) {
            this.auth.setUserEmail(body.email);
            this.auth.setUserRole(body.role);
            this.auth.setUserEmailSubscription(body.email);
            this.auth.setUserRoleSubscription(body.role);
            this.logger.info('User logged in:', this.auth.getUserEmail(), 'Role:', this.auth.getUserRole());
            localStorage.setItem('userEmail', body.email);
            localStorage.setItem('userRole', body.role);
            localStorage.setItem('userEmailSubscription', body.email);
            localStorage.setItem('userRoleSubscription', body.role);
            alert('Welcome User!');
            this.router.navigate(['/history']);
          } else if (body.role === 'admin' && body.isVerify && body.email) {
            this.auth.setUserEmail(body.email);
            this.auth.setUserRole(body.role);
            this.auth.setUserEmailSubscription(body.email);
            this.auth.setUserRoleSubscription(body.role);
            this.logger.info('User logged in:', this.auth.getUserEmail(), 'Role:', this.auth.getUserRole());
            localStorage.setItem('userEmail', body.email);
            localStorage.setItem('userRole', body.role);
            localStorage.setItem('userEmailSubscription', body.email);
            localStorage.setItem('userRoleSubscription', body.role);
            alert('Welcome admin');
            this.router.navigate(['/blog-history']);
          }


        } else {
          this.otpMessage = 'Please try Again';
        }
      },
      error: (err) => {

        this.isError = true;
        this.otpMessage = err.error;
        setTimeout(() => {
          this.otpMessage = '';
        }, 4000);
        this.logger.error(err);
      }
    });
  }

  resendOtp() {
    this.login(); // Re-send same signup call to resend OTP
  }

  startCountdown() {
    this.timeLeftMs = this.otpExpireTime;

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.updateDisplayTime();

    this.timer = setInterval(() => {
      this.timeLeftMs -= 1000;

      if (this.timeLeftMs <= 0) {
        this.timeLeftMs = 0;
        this.updateDisplayTime();
        clearInterval(this.timer);
      } else {
        this.updateDisplayTime();
      }
    }, 1000);
  }

  updateDisplayTime() {
    const minutes = Math.floor(this.timeLeftMs / 60000);
    const seconds = Math.floor((this.timeLeftMs % 60000) / 1000);
    this.displayTime = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(num: number) {
    return num < 10 ? '0' + num : num;
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

    if (!this.emailPattern.test(this.email)) {
      this.errorMessage.push(' Please enter a valid email address.');
      return;
    } else {
      this.errorMessage = []; // Clear previous errors
    }

    if (!this.passwordPattern.test(this.newPassword)) {
      this.errorMessage.push(
        '🔒 Password must be at least 6 characters long and include one capital letter, one number, and one special character.'
      );
      return;
    } else {
      this.errorMessage = []; // Clear previous errors
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
