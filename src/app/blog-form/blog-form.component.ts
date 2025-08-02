import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BlogService } from '../blog.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Logger } from 'src/logger/logger';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.scss']
})
export class BlogFormComponent {

  title = '';
  content = '';
  titleNumber =  '';
  blogTitles: string[] = [];
  filteredTitles: string[] = [];
  category: string = '';
  private logger = Logger;
  categoryList: any[] = [];

  constructor(
    private auth: AuthService,
    private blogService: BlogService,
    private router: Router,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.logger.info('user email:', this.auth.getUserEmail());
    this.logger.info('user role:', this.auth.getUserRole());
    this.blogService.getBlogs().subscribe((blogs) => {
      this.blogTitles = blogs.map((b) => b.title);
      this.filteredTitles = [...this.blogTitles];
    });
    this.loadDropdown();
  }

  loadDropdown(){
    this.getAllblog();
  }

  getAllblog(): void {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categoryList = categories;
    });
  }

  addBlog(): void {
    this.logger.info('Adding blog with this email:', this.auth.getUserEmail());
    if(this.auth.getUserRole() == 'admin' && (this.auth.getUserEmail() !== null || this.auth.getUserEmail() !== undefined)) {
      this.blogService.addBlog({ title: this.title, content: this.content, titleNumber: this.titleNumber, userEmail: this.auth.getUserEmail() || '', category: this.category }).subscribe({
      next: (data) => {
        alert('✅ Blog added successfully!');
        this.title = '';
        this.content = '';
        this.titleNumber = '';
        this.category = '';
      },
      error: (err) => {
        alert('❌ Failed to add blog. Maybe title already exists?');
      }
    });
    }else{
      alert('Please login as admin to add a blog.');
      this.router.navigate(['/login']);
    }
    
  }


  deleteBlog(): void {
    const confirmed = window.confirm(`Are you sure you want to delete blog: "${this.title}"?`);
    if (confirmed) {
      this.blogService.deleteByTitle(this.title).subscribe(() => {
        alert('🗑️ Blog deleted!');
        this.title = '';
        this.content = '';
      });
    }
  }

}
