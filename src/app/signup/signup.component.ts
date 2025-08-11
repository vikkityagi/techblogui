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
  otp = '';
  loading = false;
  otpSent = false;
  otpVerified = false;
  otpMessage: any;
  isError: boolean = false;
  otpReference: any;
  otpExpireTime: number = 0;
  timeLeftMs: number = 0; // time left in milliseconds
  displayTime: string = '';
  private timer: any;

  selectedRole: string = '';
  adminEmail: string = '';
  adminPassword: string  = '';


  errorMessages: string[] = [];
  emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  hidePassword: boolean = true; // 👈 toggle flag
  passwordPattern: RegExp = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;
  private logger = Logger; // Replace with your logging service


  constructor(private auth: AuthService, private router: Router) { 

    this.selectedRole = 'user';
  }

  ngOnInit(): void {
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  createAdmin(){

    if(!this.adminEmail || !this.adminPassword){
      this.errorMessages.push("Email or Password not Empty");
      return;
    }else{
      this.errorMessages = [];
    }

    const hashedPassword = CryptoJS.SHA256(this.password).toString();

    this.auth.adminlogin(this.adminEmail,hashedPassword).subscribe({
      next: (data)=>{
        this.logger.info(data);
      }
    })

  }

  handleStorageChange(event: StorageEvent) {
    const keysToWatch = ['userEmail', 'userRole', 'userEmailSubscription', 'userRoleSubscription'];

    if (event.newValue === null && keysToWatch.includes(event.key!)) {
      this.auth.logout();

    }
  }

  signup() {
    this.otpSent = false;
    if (!this.email || !this.password || !this.role) {
      this.errorMessages.push('⚠️ Please fill all the required fields before submitting.');
      return;
    } else {
      this.errorMessages = []; // Clear previous errors
    }
    if (!this.emailPattern.test(this.email)) {
      this.errorMessages.push(' Please enter a valid email address.');
      return;
    } else {
      this.errorMessages = []; // Clear previous errors
    }

    if (!this.passwordPattern.test(this.password)) {
      this.errorMessages.push(
        '🔒 Password must be at least 6 characters long and include one capital letter, one number, and one special character.'
      );
      return;
    } else {
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
        } else if (body && data.status === 201 && body.otpExpirationTime) {
          this.logger.log('Signup successful:', data);
          this.otpExpireTime = body.otpExpirationTime;
          this.startCountdown();
          if (this.otpVerified && !body.isVerify) {
            // this.router.navigate(['/login']);

          } else {
            setTimeout(() => {
              this.errorMessages = [];
            }, 6000);
            this.otpExpireTime = body.otpExpirationTime;
            this.startCountdown();
            this.otpReference = body.otpReference;
            this.errorMessages.push('Please verify the user first');
          }

          this.loading = false;
          this.otpSent = true;

        } else {
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

  verifyOtp() {
    this.auth.verifyOtp({ email: this.email, otp: this.otp, otpReference: this.otpReference }).subscribe({
      next: (res) => {
        const body = res.body;
        if (body && body.isVerify) {
          this.otpVerified = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
            this.otpMessage = '';
          }, 3000);
          this.otpMessage = body.message;

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
    this.signup(); // Re-send same signup call to resend OTP
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
}
