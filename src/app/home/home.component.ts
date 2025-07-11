import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { Blog } from '../model/blog.model';
import { HistoryService } from '../history.service';
import { AuthService } from '../auth.service';
import { Logger } from 'src/logger/logger';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  blog :any = null; // Initialize with null or an empty object
  private logger = Logger; // Use console for logging, or replace with your Logger service

  constructor(private blogService: BlogService,private historyService: HistoryService,private authService: AuthService) { }

  ngOnInit(): void {
    // Any initialization logic can go here
    this.blogService.getLatestBlog().subscribe({
      next: (blog) => {
        this.blog = blog;
      },
      error: (err) => {
        console.error('Error fetching latest blog:', err);
      }
    });

    if (localStorage.getItem('userEmail') && localStorage.getItem('userRole') && localStorage.getItem('userEmailSubscription') && localStorage.getItem('userRoleSubscription')) {
      alert('Welcome back! You are already logged in.');
      this.authService.setUserEmail(localStorage.getItem('userEmail')!);
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'admin' || userRole === 'user') {
        this.authService.setUserRole(userRole);
      }
      this.authService.setUserEmailSubscription(localStorage.getItem('userEmailSubscription')!);
      this.authService.setUserRoleSubscription(localStorage.getItem('userRoleSubscription')!);
    }

  }

  

  // You can add methods to handle user interactions or data fetching if needed



}
