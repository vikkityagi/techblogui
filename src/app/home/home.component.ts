import { Component, OnInit, ViewChild } from '@angular/core';
import { BlogService } from '../blog.service';
import { Blog } from '../model/blog.model';
import { HistoryService } from '../history.service';
import { AuthService } from '../auth.service';
import { Logger } from 'src/logger/logger';
import { CarouselComponent } from 'ngx-bootstrap/carousel';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild(CarouselComponent) carousel?: CarouselComponent;


  // currentSlide = 0;



  blog: any = null; // Initialize with null or an empty object
  private logger = Logger; // Use console for logging, or replace with your Logger service
  categoryList: any[] = []; // Initialize with an empty array

  constructor(private blogService: BlogService, private historyService: HistoryService, private authService: AuthService,
    private categoryService: CategoryService
  ) { }

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

    if (localStorage.getItem('userEmail') != null && localStorage.getItem('userRole') != null && localStorage.getItem('userEmailSubscription') != null && localStorage.getItem('userRoleSubscription') != null) {
      alert('Welcome back! You are already logged in.');
      this.authService.setUserEmail(localStorage.getItem('userEmail')!);
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'admin' || userRole === 'user') {
        this.authService.setUserRole(userRole);
      }
      this.authService.setUserEmailSubscription(localStorage.getItem('userEmailSubscription')!);
      this.authService.setUserRoleSubscription(localStorage.getItem('userRoleSubscription')!);
    }

    this.getAllCategories(); // Fetch categories on component initialization

  }



  getAllCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.logger.log('Fetched categories:', categories);
        this.categoryList = categories; // Store fetched categories in the component
      },
      error: (err) => {
        this.logger.error('Error fetching categories:', err);
      }
    });
  }

  imageList = [
    {
      src: 'assets/images/image1.jpg',
      title: 'Tech Trends 2025',
      description: 'Explore the top 10 upcoming tech trends you can’t miss.',
      link: '/blog/tech-trends-2025'
    },
    {
      src: 'assets/images/image2.jpg',
      title: 'AI in Daily Life',
      description: 'How artificial intelligence is shaping our future.',
      link: '/blog/ai-daily-life'
    },
    {
      src: 'assets/images/image3.jpg',
      title: 'Secure Web Development',
      description: 'Learn best practices to secure your web apps.',
      link: '/blog/web-security'
    }
  ];




  // You can add methods to handle user interactions or data fetching if needed



}
