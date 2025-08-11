import { inject, Injectable } from '@angular/core';
import { User } from './model/user.model';
import { environment } from 'src/environment/environment';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Logger } from 'src/logger/logger';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private router = inject(Router); // Inject Router if you need to navigate after logout

  users: User[] = [];
  currentUser: User | null = null;
  private readonly url = environment.apiBaseUrl;
  private logger = Logger;
  private emailSubscription = new Subject<string>();
  emailSubscription$ = this.emailSubscription.asObservable();
  private roleSubscription = new Subject<string>();
  roleSubscription$ = this.roleSubscription.asObservable();

  constructor(private http: HttpClient) { }

  register(user: User): Observable<HttpResponse<User>> {
    const url = `${this.url}/users/signup`; // Adjust path to match your backend API
    this.logger.info('Registering user:', user);
    this.logger.info('API URL:', url);
    return this.http.post<User>(url, user, {
      observe: 'response'
    });
  }

  login(email: string, password: string): Observable<HttpResponse<User>> {

    const url = `${this.url}/users/login`; // Adjust path to match your backend API
    this.logger.info('Logging in user:', { email, password });
    this.logger.info('API URL:', url);
    return this.http.post<User>(url, { email, password }, {
      observe: 'response'
    });
  }

  adminlogin(email: string,password: string): Observable<HttpResponse<User>>{
    const url = `${this.url}/users/admin/create`; // Adjust path to match your backend API
    this.logger.info('Logging in admin:', { email, password });
    this.logger.info('API URL:', url);
    return this.http.post<User>(url, { email, password }, {
      observe: 'response'
    });
  }

  getUserEmail(): string | null {
    return this.currentUser?.email || null;
  }

  getUserRole(): string | null {
    return this.currentUser?.role || null;
  }

  setUserEmail(email: string): void {
    if (!this.currentUser) this.currentUser = {} as User;
    this.currentUser.email = email;
  }

  setUserRole(role: 'admin' | 'user'): void {
    if (!this.currentUser) this.currentUser = {} as User;
    this.currentUser.role = role;
  }

  setUserEmailSubscription(email: string): void {
    if (!this.currentUser) this.currentUser = {} as User;
    // this.currentUser.emailSubscription = email;
    this.emailSubscription.next(email);
    this.logger.info('User email subscription set:', email);
  }

  setUserRoleSubscription(role: string): void {
    if (!this.currentUser) this.currentUser = {} as User;
    this.roleSubscription.next(role);
    this.logger.info('User role subscription set:', role);
  }



  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  // logout(): void {
  //   this.currentUser = null;
  // }

  resetPassword(email: string, newPassword: string): Observable<User> {
    return this.http.post<User>(`${this.url}/users/reset`, { email: email, password: newPassword });
  }

  logout(): void {
    this.logger.info('Logging out user:', this.currentUser?.email);

    // Clear the current user
    this.currentUser = null;

    // Notify subscribers (e.g., components listening to email/role changes)
    this.emailSubscription.next('');
    this.roleSubscription.next('');

    // Optionally, clear localStorage or sessionStorage if you're storing login info
    const keysToRemove = [
      'userEmail',
      'userRole',
      'userEmailSubscription',
      'userRoleSubscription'
    ];

    const anyKeyExists = keysToRemove.some(key => localStorage.getItem(key) !== null);

    if (anyKeyExists) {
      keysToRemove.forEach(key => {
        if (localStorage.getItem(key) !== null) {
          localStorage.removeItem(key);
        }
      });
      alert('✅ User logged out');
      this.router.navigate(['/login']); // only if Router is injected
    } else {
      console.log('⚠️ Logout skipped: no keys found');
    }


    // Optional: redirect to login (if using router here)

  }

  verifyOtp(request: { email: string, otp: string, otpReference: string }): Observable<HttpResponse<User>> {
    const url = `${this.url}/users/verify-otp`; // Adjust path to match your backend API
    this.logger.info('Verifying OTP for user:', request);
    this.logger.info('API URL:', url);
    return this.http.post<User>(url, request, {
      observe: 'response'
    });
  }

  // getJsonWebToken() {
  //   const token = 'Tag47BZJ1DdAm3jVFaO33xS0UKPVcSKA'; // Replace this with your actual token
  //   const url = 'https://your-api.com/endpoint';

  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`,
  //     'Content-Type': 'application/json'
  //   });
  //   return this.http.post(`https://nextgen.ehospital.nic.in/api/ipd/doc/vitalsListDataList`,{ "ipdid": 27, "health_facility_id": 136 }, { headers });
  // }

}
