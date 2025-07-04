declare var Razorpay: any; // Declare Razorpay globally
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Blog } from '../model/blog.model';
import { HistoryService } from '../history.service';
import { AuthService } from '../auth.service';
import { BlogHistory } from '../model/blog-history.model';
import { Router } from '@angular/router';
import { Logger } from 'src/logger/logger';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss']
})
export class UserHistoryComponent implements OnInit {

  // blogs: Blog[] = [];
  myHistory: Blog[] = [];
  history: BlogHistory[] = [];
  email: string | null = null;

  // For search
  searchTitle = '';
  titles: string[] = [];
  selectedBlog: any;

  private logger = Logger;


  constructor(private auth: AuthService, private historyService: HistoryService, private router: Router,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.email = this.auth.getUserEmail();

    if (this.email) {
      this.historyService.getHistory(this.email).subscribe({
        next: (history) => {
          this.history = history;
          this.titles = history.map((h) => h.blog.title);
          // Show latest added blog by default
          if (this.history.length > 0) {
            // this.selectedBlog = this.history[this.history.length - 1];
            this.selectedBlog = this.history;
          }
        },
        error: (err) => {
          console.error('Error fetching history:', err);
        }
      });

      // Show latest added blog by default
      if (this.history.length > 0) {
        this.selectedBlog = this.history[this.history.length - 1];
      }
    } else {
      alert('Please login to view your history.');
      this.router.navigate(['/login']);
    }
  }

  search(): void {
    if (this.email && this.searchTitle.trim()) {
      const blog = this.historyService.getBlogFromHistoryByTitle(this.email, this.searchTitle);
      if (blog) {
        this.selectedBlog = blog;
      } else {
        this.selectedBlog = null;
        alert('Blog not found in your history.');
      }
    }
  }

  pay(id: string): void {

    if (this.auth.getUserRole() == null && this.auth.getUserEmail() == null) {
      alert('Please login first!');
      this.router.navigate(['/login']);
      return;
    }
    this.logger.info('Initiating payment for blog:', id);
    this.logger.info('User email:', this.auth.getUserEmail());
    localStorage.setItem('email', this.auth.getUserEmail() || '');
    const options: any = {
      key: 'rzp_test_LeBHwqYzi5GJsS', // Replace with your Razorpay key
      amount: 200, // Amount in paisa (₹4)
      currency: 'INR',
      name: 'TechYatra Blog',
      description: 'Blog Access Payment',
      handler: (response: any) => {
        const email = localStorage.getItem('email');
        if (email && response['razorpay_payment_id']) {
          this.historyService.markAsPaid(id, true).subscribe({
            next: () => {
              alert('✅ Payment Successful! Blog unlocked.');
              const paidBlog = this.selectedBlog.find((b: any) => b.blog.id === id);
              if (paidBlog) {
                paidBlog.isPaid = true;
                this.cdr.detectChanges(); // Ensure change detection runs
                // Force Angular to detect the change
                // this.selectedBlog = [...this.selectedBlog];
              }
            }, error: err => {
              this.logger.error('Error marking blog as paid:', err);
              alert('❌ Payment failed or blog already paid.');
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

  trackByBlogId(index: number, blog: any): string {
    return blog.blog.id;
  }

}
