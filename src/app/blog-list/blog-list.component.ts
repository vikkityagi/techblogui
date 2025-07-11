declare var Razorpay: any;
import { Component } from '@angular/core';
import { Blog } from '../model/blog.model';
import { BlogService } from '../blog.service';
import { HistoryService } from '../history.service';
import { AuthService } from '../auth.service';
import { Logger } from 'src/logger/logger';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent {

  todayBlogs: Blog[] = [];
  filterType: any = '';
  filteredBlogs: Blog[] = [];
  allTitles: Blog[] = [];
  searchTitle = '';
  role: string | null = null;
  private logger = Logger;

  fromDate: Date | null = null;
  toDate: Date | null = null;

  allBlogs: Blog[] = [];

  constructor(
    private blogService: BlogService,
    private historyService: HistoryService,
    private authService: AuthService,
    private router: Router
  ) { }

  // create

  ngOnInit(): void {
    this.getBlogs();
    this.role = this.authService.getUserRole();
    // this.onFilterTypeChange('title'); // Load all titles on init
  }

  getBlogs(): void {
    this.blogService.getBlogs().subscribe((blogs) => {
      this.filteredBlogs = blogs;

    });
  }

  // filterBlogByTitle(): void {
  //   if (!this.searchTitle.trim()) {
  //     this.filteredBlogs = [...this.todayBlogs];
  //     return;
  //   }

  //   this.blogService.getBlogById(this.searchTitle).subscribe({
  //     next: (blog) => {
  //       this.filteredBlogs = [blog]; // 🟢 Only one blog to show
  //     },
  //     error: () => {
  //       this.filteredBlogs = [];

  //     }
  //   });
  // }

  // resetFilter(): void {
  //   this.searchTitle = '';
  //   this.filteredBlogs = [...this.todayBlogs];
  // }

  saveToHistory(blog: Blog): void {
    let email = this.authService.getUserEmail();
    if (email) {
      this.historyService.addBlogInHistory(email, blog, false).subscribe({
        next: (blogHistory) => {
          if(!blogHistory || !blogHistory.id) {
            this.logger.error('Blog not saved in history, received empty response:', blogHistory);
            alert('❌ Failed to add blog to history. Please try again later or May be blog already exists in history.');
            return;
          }
          this.logger.info('Blog saved in history:', blogHistory);
          this.logger.info('Blog added to history:', blogHistory.blog.title);
          alert('✅ Blog added to your history!');
        },
        error: (err) => {
          this.logger.error('Error adding blog to history:', err);
          alert('❌ Failed to add blog to history.');
        }
      });
    } else {
      alert('Please login first!');
      this.router.navigate(['/login']);
    }
  }

  onFilterTypeChange(filter: string) {
    this.logger.info('Filter type changed to:', filter);
    if (filter === 'title') {
      // Fetch all titles when 'title' is selected
      this.blogService.getBlogs().subscribe({
        next: (blogs) => {
          this.allTitles = blogs;
        },
        error: (err) => {
          this.logger.error('Error loading titles:', err);
        }
      });
    } else {
      this.allTitles = []; // Clear titles if 'date' is selected
    }
  }

  filterBlogByTitle(value: any) {
    if (value) {
      this.logger.info('Filtering blogs by title:', value);
      this.blogService.getBlogById(value).subscribe({
        next: (blog) => {
          this.filteredBlogs = [blog]; // 🟢 Only one blog to show
          this.logger.info('Filtered blog:', blog);
        },
        error: (err) => {
          this.logger.error('Error fetching blog by title:', err);
          this.filteredBlogs = []; // Reset if no blog found
        }
      });
    }
  }

  filterBlogByDate() {
    if (this.fromDate && this.toDate) {
      this.logger.info('Filtering blogs by date:', this.fromDate, this.toDate);
      const from = this.formatDate(this.fromDate);
      const to = this.formatDate(this.toDate);
      this.logger.info('Filtering blogs from:', from, 'to:', to);
      this.blogService.getBlogs(from, to).subscribe({
        next: (blogs) => {
          this.filteredBlogs = blogs;
          this.allBlogs = blogs; // Store all blogs for future reference
          this.logger.info('Filtered blogs:', this.filteredBlogs);
        }, error: (err) => {
          this.logger.error('Error fetching blogs by date:', err);
        }
      })
      // this.filteredBlogs = this.allBlogs.filter(blog => {
      //   const blogDate = new Date(blog.date).getTime();
      //   return blogDate >= from && blogDate <= to;
      // });
    } else {
      alert('Please select both From and To dates.');
      this.filteredBlogs = [...this.allBlogs]; // Reset to all blogs if dates are not selected
    }
  }

  // pay(blog: Blog): void {

  //   if (this.authService.getUserRole() == null && this.authService.getUserEmail() == null) {
  //     alert('Please login first!');
  //     this.router.navigate(['/login']);
  //     return;
  //   }
  //   this.logger.info('Initiating payment for blog:', blog.title);
  //   this.logger.info('User email:', this.authService.getUserEmail());
  //   localStorage.setItem('email', this.authService.getUserEmail() || '');
  //   const options: any = {
  //     key: 'rzp_test_LeBHwqYzi5GJsS', // Replace with your Razorpay key
  //     amount: 200, // Amount in paisa (₹2)
  //     currency: 'INR',
  //     name: 'TechYatra Blog',
  //     description: 'Blog Access Payment',
  //     handler: (response: any) => {
  //       const email = localStorage.getItem('email');
  //       if (email && response['razorpay_payment_id']) {
  //         this.historyService.addBlogInHistory(email, blog, true).subscribe({
  //           next: () => {
  //             alert('✅ Payment Successful! Blog unlocked. and Blog saved in history.');

  //           }, error: err => {
  //             this.logger.error('Error saving blog in history:', err);
  //             alert('❌ Payment successful but failed to save blog in history. Please try again later.');
  //           }
  //         });

  //       } else {
  //         alert('Please login first!');
  //       }
  //       // this.historyService.addBlogInHistory(email, blog);
  //     },
  //     prefill: {
  //       name: 'Vikki',
  //       email: 'vikkityagi1998@gmail.com'
  //     }
  //   };

  //   const rzp = new Razorpay(options);
  //   rzp.open();
  // }

  showAll(): void {
    this.logger.info('Showing all blogs');
    this.getBlogs(); // Fetch all blogs again
  }

  formatDate(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-IN'); // Use local format
  }

}
