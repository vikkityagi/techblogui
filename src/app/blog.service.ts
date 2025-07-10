import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Blog } from './model/blog.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {



  private apiUrl = environment.apiBaseUrl; // Spring Boot API

  constructor(private http: HttpClient) { }

  getBlogs(fromDate?: string, toDate?: string): Observable<Blog[]> {
    if(fromDate && toDate) {
      return this.http.get<Blog[]>(`${this.apiUrl}/blogs?fromDate=${fromDate}&toDate=${toDate}`);
    }
    return this.http.get<Blog[]>(`${this.apiUrl}/blogs`);
  }

  addBlog(blog: Blog): Observable<Blog> {
    return this.http.post<Blog>(`${this.apiUrl}/blogs`, blog);
  }

  getBlogByTitle(title: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/blog/${title}`);
  }

  getBlogById(id: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/blogs/${id}`);
  } 

  getLatestBlog(): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/blogs/latest`);
  }

  // deleteByTitle(title: string): void {
  //   const originalLength = this.getBlogs.length;
  //   this.history = this.history.filter(blog => blog.title !== title);
  //   if (this.history.length < originalLength) {
  //     console.log(`Blog with title '${title}' deleted.`);
  //   } else {
  //     console.log(`No blog found with title '${title}'.`);
  //   }
  // }
  deleteByTitle(title: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/title/${encodeURIComponent(title)}`);
  }






}
