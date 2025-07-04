import { Component, OnInit } from '@angular/core';
import { Blog } from '../model/blog.model';
import { HistoryService } from '../history.service';
import { AuthService } from '../auth.service';
import { BlogHistory } from '../model/blog-history.model';
import { Router } from '@angular/router';

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


  constructor(private auth: AuthService, private historyService: HistoryService,private router: Router) {}

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
    }else{
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

  pay(blog: Blog): void {
    alert('Payment simulation complete!');
    if (this.email) {
      this.historyService.markAsPaid(this.email, blog.title);
      this.selectedBlog!.isPaid = true;
    }
  }

}
