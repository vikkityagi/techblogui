declare var Razorpay: any; // Declare Razorpay globally
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Blog } from '../model/blog.model';
import { HistoryService } from '../history.service';
import { AuthService } from '../auth.service';
import { BlogHistory } from '../model/blog-history.model';
import { NavigationEnd, Router } from '@angular/router';
import { Logger } from 'src/logger/logger';
import { MatDialog } from '@angular/material/dialog';
import { BlogDialogComponent } from '../blog-dialog/blog-dialog.component';
import { formatDate } from '@angular/common';
import { filter, take } from 'rxjs';

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
  searchId: any = '';
  titles: { id: number | string; title: string }[] = [];

  selectedBlog: any;

  private logger = Logger;
  fromDate: Date | null = null;
  toDate: Date | null = null;
  today: Date = new Date();


  constructor(private auth: AuthService, private historyService: HistoryService, private router: Router, private cdr: ChangeDetectorRef, private dialog: MatDialog) { }

  ngOnInit(): void {
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    this.email = this.auth.getUserEmail();

    if (this.email) {
      this.historyService.getHistory(this.email).subscribe({
        next: (history) => {
          this.history = history;
          // Get all blog dates
          const dates = history.map((h:any) => new Date(h.createdAt));

          // Sort dates to find min and max
          const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());

          this.fromDate = sortedDates[0]; // Earliest date
          this.toDate = sortedDates[sortedDates.length - 1]; // Latest date
          this.titles = history.map((h) => ({
            id: h.blog.id!,
            title: h.blog.title
          }));
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

  handleStorageChange(event: StorageEvent) {
    const keysToWatch = ['userEmail', 'userRole', 'userEmailSubscription', 'userRoleSubscription'];

    if (event.newValue === null && keysToWatch.includes(event.key!)) {
      this.auth.logout();

    }
  }

  readFullBlog(blog: any): void {
    this.dialog.open(BlogDialogComponent, {
      width: '80%',
      data: blog
    });
  }

  filterBlogByDate() {
    this.email = this.auth.getUserEmail();
    if (this.fromDate && this.toDate && this.email) {
      this.logger.info('Filtering blogs by date:', this.fromDate, this.toDate);
      const from = this.formatDate(this.fromDate);
      const to = this.formatDate(this.toDate);
      this.logger.info('Filtering blogs from:', from, 'to:', to);
      this.historyService.getHistory(this.email, from, to).subscribe({
        next: (blogs) => {
          this.selectedBlog = blogs;
          this.titles = blogs.map((h) => ({
            id: h.blog.id!,
            title: h.blog.title
          }));
          this.logger.info('Filtered blogs:', this.selectedBlog);
        }, error: (err) => {
          this.logger.error('Error fetching blogs by date:', err);
          this.fromDate = null;
          this.toDate = null;
          alert('Error fetching blogs by date. Please try again later.');
        }
      })
      // this.filteredBlogs = this.allBlogs.filter(blog => {
      //   const blogDate = new Date(blog.date).getTime();
      //   return blogDate >= from && blogDate <= to;
      // });
    } else {
      alert('Please select both From and To dates.');

    }
  }

  formatDate(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-IN'); // Use local format
  }

  search(): void {
    if (this.email) {
      this.logger.info('Searching for blog with ID:', this.searchId);
      this.logger.info('selectedBlog before search:', this.selectedBlog);

      this.selectedBlog = this.selectedBlog.filter((h: any) => h.blog.id === this.searchId.id);
      // this.logger.info('selectblog inside blog id ', this.selectedBlog.blog.id);


      this.logger.info('selectedBlog after search:', this.selectedBlog);
    }
  }

  // pay(blogHistoryid: string,blogId: any): void {

  //   if (this.auth.getUserRole() == null && this.auth.getUserEmail() == null) {
  //     alert('Please login first!');
  //     this.router.navigate(['/login']);
  //     return;
  //   }
  //   this.logger.info('Initiating payment for blog:', blogHistoryid);
  //   this.logger.info('User email:', this.auth.getUserEmail());
  //   localStorage.setItem('email', this.auth.getUserEmail() || '');
  //   const options: any = {
  //     key: 'rzp_test_LeBHwqYzi5GJsS', // Replace with your Razorpay key
  //     amount: 200, // Amount in paisa (₹4)
  //     currency: 'INR',
  //     name: 'TechYatra Blog',
  //     description: 'Blog Access Payment',
  //     handler: (response: any) => {
  //       const email = localStorage.getItem('email');
  //       if (email && response['razorpay_payment_id']) {
  //         this.historyService.markAsPaid(blogHistoryid, true).subscribe({
  //           next: (status) => {
  //             alert('✅ Payment Successful! Blog unlocked.');
  //             if (status) {
  //               this.logger.info('blogHistoryid', blogHistoryid);
  //               this.logger.info('selectedblog',this.selectedBlog);
  //               this.selectedBlog.find((b: any) => b.blog.id === blogId).isPaid = true; // Update the blog's paid status
  //               this.logger.info('selectedblog after payment',this.selectedBlog);
  //               this.cdr.detectChanges(); // Trigger change detection

  //             }
  //           }, error: err => {
  //             this.logger.error('Error marking blog as paid:', err);
  //             alert('❌ Payment failed or blog already paid.');
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

  trackByBlogId(index: number, blog: any): string {
    return blog.blog.id;
  }

  displayTitle(blog: any): string {
    return blog?.title || '';
  }

  // async hashToBase36(s1: string, s2: string, length: number = 36): Promise<string> {
  //   const combined = s1 + s2;

  //   // Encode to Uint8Array
  //   const encoder = new TextEncoder();
  //   const data = encoder.encode(combined);

  //   // Hash using SHA-256
  //   const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  //   // Convert buffer to BigInt
  //   const hashArray = Array.from(new Uint8Array(hashBuffer));
  //   const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  //   const hashBigInt = BigInt('0x' + hashHex);

  //   // Convert BigInt to base36
  //   let base36 = hashBigInt.toString(36);

  //   // Pad or trim to exactly `length` characters
  //   if (base36.length < length) {
  //     base36 = base36.padStart(length, '0');
  //   } else if (base36.length > length) {
  //     base36 = base36.slice(0, length);
  //   }

  //   return base36;
  // }
  // hash.util.ts (or inside your service/component)



}
