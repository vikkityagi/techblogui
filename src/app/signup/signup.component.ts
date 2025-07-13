import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  email = '';
  password = '';
  role: 'user' | 'admin' = 'user';

  errorMessage: string = '';
  emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  hidePassword: boolean = true; // 👈 toggle flag
  passwordPattern: RegExp = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;


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
      this.errorMessage = '⚠️ Please fill all the required fields before submitting.';
      return;
    }

    if (!this.emailPattern.test(this.email)) {
      this.errorMessage = '📧 Please enter a valid email address.';
      return;
    }

    if (!this.passwordPattern.test(this.password)) {
      this.errorMessage =
        '🔒 Password must be at least 6 characters long and include one capital letter, one number, and one special character.';
      return;
    }


    // You can add more validation here (e.g. email format, password strength)

    // Clear error if validation passes
    this.errorMessage = '';
    this.auth.register({ email: this.email, password: this.password, role: this.role }).subscribe({
      next: () => {
        alert('Signup successful! Please log in.');
        this.router.navigate(['/login']);
      },
      error: err => {
        
        if (err?.error?.message) {
          this.errorMessage = `🚫 ${err.error.message}`;
        } else {
          this.errorMessage = '🚫 Signup failed due to server error.';
        }
        console.error('Signup error:', err);
      }
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
