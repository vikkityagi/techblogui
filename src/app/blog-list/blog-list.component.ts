declare var Razorpay: any;
import { Component } from '@angular/core';
import { Blog } from '../model/blog.model';
import { BlogService } from '../blog.service';
import { HistoryService } from '../history.service';
import { AuthService } from '../auth.service';
import { Logger } from 'src/logger/logger';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent {

  todayBlogs: Blog[] = [];

  filteredBlogs: Blog[] = [];
  allTitles: string[] = [];
  searchTitle = '';
  role: string | null  = null;
  private logger = Logger;

  constructor(
    private blogService: BlogService,
    private historyService: HistoryService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const today = new Date().toISOString().slice(0, 10); // e.g. "2025-07-02"

    this.blogService.getBlogs().subscribe((blogs) => {
      this.todayBlogs = blogs.filter((blog) => {
        if (!blog.date) return false;
        const blogDate = new Date(blog.date).toISOString().slice(0, 10);
        return blogDate === today;
      });
      this.filteredBlogs = [...this.todayBlogs];
      this.allTitles = this.todayBlogs.map((b) => b.title);
      this.logger.info('Today\'s blogs:', this.todayBlogs);
    });
    this.role = this.authService.getUserRole();
  }

  filterBlogByTitle(): void {
    if (!this.searchTitle.trim()) {
      this.filteredBlogs = [...this.todayBlogs];
      return;
    }

    this.blogService.getBlogById(this.searchTitle).subscribe({
      next: (blog) => {
        this.filteredBlogs = [blog]; // 🟢 Only one blog to show
      },
      error: () => {
        this.filteredBlogs = [];
        
      }
    });
  }

  resetFilter(): void {
    this.searchTitle = '';
    this.filteredBlogs = [...this.todayBlogs];
  }

  saveToHistory(blog: Blog): void {
    let email = this.authService.getUserEmail();
    if (email) {
      this.historyService.addBlogInHistory(email, blog, false);
      alert('✅ Blog added to your history!');
    } else {
      alert('Please login first!');
    }
  }

  pay(blog: Blog): void {
    
    if(this.authService.getUserRole() == null && this.authService.getUserEmail() == null) {
      alert('Please login first!');
      this.router.navigate(['/login']);
      return;
    }
    this.logger.info('Initiating payment for blog:', blog.title);
    this.logger.info('User email:', this.authService.getUserEmail());
    localStorage.setItem('email', this.authService.getUserEmail() || '');
    const options: any = {
      key: 'rzp_test_LeBHwqYzi5GJsS', // Replace with your Razorpay key
      amount: 200, // Amount in paisa (₹2)
      currency: 'INR',
      name: 'TechYatra Blog',
      description: 'Blog Access Payment',
      handler: (response: any) => {
        const email = localStorage.getItem('email');
        if (email && response['razorpay_payment_id']) {
          this.historyService.addBlogInHistory(email, blog, true).subscribe({
            next: () => {
              alert('✅ Payment Successful! Blog unlocked. and Blog saved in history.');

            },error:err=>{
              this.logger.error('Error saving blog in history:', err);
              alert('❌ Payment successful but failed to save blog in history. Please try again later.');
            }
          });

        } else {
          alert('Please login first!');
        }
        // this.historyService.addBlogInHistory(email, blog);
      },
      prefill: {
        name: 'Vikki',
        email: 'vikkityagi1998@gmail.com'
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

}
