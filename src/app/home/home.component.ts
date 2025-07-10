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
  }

  

  // You can add methods to handle user interactions or data fetching if needed



}
