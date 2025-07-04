import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  email = '';
  password = '';
  role: 'user' | 'admin' = 'user';

  constructor(private auth: AuthService, private router: Router) { }

  signup() {
    this.auth.register({ email: this.email, password: this.password, role: this.role }).subscribe({
      next: () => {
        alert('Signup successful! Please log in.');
        this.router.navigate(['/login']);
      },
      error: err => {
        alert('Signup failed. Maybe user already exists.');
        console.error(err);
      }
    });
  }
}
