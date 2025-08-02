declare var Razorpay: any;
import { Component } from '@angular/core';
import { Blog } from '../model/blog.model';
import { BlogService } from '../blog.service';
import { HistoryService } from '../history.service';
import { AuthService } from '../auth.service';
import { Logger } from 'src/logger/logger';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { filter, take } from 'rxjs';
import { CategoryService } from '../category.service';

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
  categoryList: any[] = [];
  allBlogs: Blog[] = [];
  today: Date = new Date();
  category: string = '';
  categoryIdFromParam: any = '';
  fromDateHistory: Date | null = null;
  toDateHistory: Date | null = null;

  constructor(
    private blogService: BlogService,
    private historyService: HistoryService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) { }

  // create

  ngOnInit(): void {
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    this.loadDropdown();

    this.role = this.authService.getUserRole();
    // this.onFilterTypeChange('title'); // Load all titles on init
  }

  getRouterData() {
    this.route.paramMap.subscribe(params => {
      this.categoryIdFromParam = params.get('id');
      const title = params.get('title');

      console.log('Blog ID:', this.categoryIdFromParam);
      console.log('Title:', title);
    });
  }

  loadDropdown() {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categoryList = categories;
        if (this.categoryList.length > 0) {
          this.getRouterData(); // Get category ID from route parameters
          this.logger.log('Fetched categories:', this.categoryList);
          // If category ID is provided in the route, filter blogs by that category
          if (this.categoryIdFromParam) {
            this.category = this.categoryIdFromParam;
          }
          // If no category ID is provided, default to the first category
          else {
            this.category = this.categoryList[0].id; // Default to first category if none
          }

          this.blogService.getBlogs(undefined, undefined, this.category).subscribe({
            next: (blogs) => {
              this.allBlogs = blogs;
              this.filteredBlogs = blogs;
              this.allTitles = blogs; // Store all titles
              const dates = blogs.map((h: any) => new Date(h.date));
              const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());

              this.fromDate = sortedDates[0]; // Earliest date
              this.toDate = sortedDates[sortedDates.length - 1]; // Latest date
            },
            error: (err) => {
              this.logger.error('Error fetching blogs for default category:', err);
            }
          });
          // this.category = this.categoryList[0].id; // Set default category
        }
      },
      error: (err) => {
        this.logger.error('Error fetching categories:', err);
      }
    });
  }


  handleStorageChange(event: StorageEvent) {
    const keysToWatch = ['userEmail', 'userRole', 'userEmailSubscription', 'userRoleSubscription'];

    if (event.newValue === null && keysToWatch.includes(event.key!)) {
      this.authService.logout();

    }
  }


  getBlogs(): void {
    this.blogService.getBlogs().subscribe({
      next: blogs => {
        if (blogs.length > 0) {
          this.filteredBlogs = blogs;
          // Get all blog dates
          const dates = blogs.map((h: any) => new Date(h.date));

          // Sort dates to find min and max
          const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());

          this.fromDate = sortedDates[0]; // Earliest date
          this.toDate = sortedDates[sortedDates.length - 1]; // Latest date
        }


      }, error: err => {
        alert("No blog found");
      }
    })

    // });
  }



  saveToHistory(blog: Blog): void {
    let email = this.authService.getUserEmail();
    if (email) {
      this.historyService.addBlogInHistory(email, blog, false).subscribe({
        next: (blogHistory) => {
          if (!blogHistory || !blogHistory.id) {
            this.logger.error('Blog not saved in history, received empty response:', blogHistory);
            alert('❌ Failed to add blog to history. Please try again later or May be blog already exists in history.');
            return;
          }
          this.logger.info('Blog saved in history:', blogHistory);
          this.logger.info('Blog added to history:', blogHistory.blog.title);
          alert('✅ Blog added to your history!');
          this.router.navigate(['/history']);
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



  onSelectCategory(categoryId: string): void {
    this.filterType = '';
    this.fromDate = null;
    this.toDate = null;
    
    this.blogService.getBlogs(undefined, undefined, categoryId).subscribe({
      next: (blogs) => {
        this.allBlogs = blogs;
        this.filteredBlogs = blogs;
        this.allTitles = blogs; // Store all titles

        const dates = blogs.map((h: any) => new Date(h.date));
        const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());

        this.fromDate = sortedDates[0]; // Earliest date
        this.toDate = sortedDates[sortedDates.length - 1]; // Latest date
      },
      error: (err) => {
        this.logger.error('Error fetching blogs for default category:', err);
      }
    });
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
    // this.fromDate = null;
    // this.toDate = null;
    if (this.fromDate && this.toDate) {
      this.logger.info('Filtering blogs by date:', this.fromDate, this.toDate);
      const from = this.formatDate(this.fromDate);
      const to = this.formatDate(this.toDate);
      this.logger.info('Filtering blogs from:', from, 'to:', to);
      this.blogService.getBlogs(from, to, this.category).subscribe({
        next: (blogs) => {
          this.filteredBlogs = blogs;
          this.allBlogs = blogs; // Store all blogs for future reference
          this.logger.info('Filtered blogs:', this.filteredBlogs);

          
        }, error: (err) => {
          this.logger.error('Error fetching blogs by date:', err);
        }
      })

    } else {
      alert('Please select both From and To dates.');
      this.filteredBlogs = [...this.allBlogs]; // Reset to all blogs if dates are not selected
    }
  }



  showAll(event: Event): void {
    event.preventDefault();
    this.logger.info('Showing all blogs');
    this.getBlogs(); // Fetch all blogs again
  }

  formatDate(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-IN'); // Use local format
  }

}
