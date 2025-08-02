import { Injectable } from '@angular/core';
import { Blog } from './model/blog.model';
import { BlogHistory } from './model/blog-history.model';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private url = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  private historyMap: { [email: string]: BlogHistory[] } = {};

  // addBlogInHistory(blog: Blog) {
  //   // Prevent duplicate entries
  //   if (!this.history.find(b => b.id === blog.id)) {
  //     this.history.push(blog);
  //   }
  // }

  // getHistory(): Blog[] {
  //   return this.history;
  // }

  addBlogInHistory(userEmail: string, blog: Blog, isPaid: boolean): Observable<BlogHistory> {
    return this.http.post<BlogHistory>(`${this.url}/history/save`, { userEmail, blog, isPaid });
  }

  getHistoryByEmail(userEmail: string): Observable<BlogHistory[]> {
    return this.http.get<BlogHistory[]>(`${this.url}/history/${userEmail}`);
  }

  markAsPaid(id: string, status: boolean): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/history/${id}/pay/${status}`);
  }

  getHistory(userEmail: string , fromDate?: string, toDate?: string): Observable<BlogHistory[]> {
    if (fromDate && toDate) {
      return this.http.get<BlogHistory[]>(`${this.url}/history/${userEmail}?from=${fromDate}&to=${toDate}`);
    }
    return this.http.get<BlogHistory[]>(`${this.url}/history/${userEmail}`);
  }

  getHistoryTitles(userEmail: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/history/titles/${userEmail}`);
  }

  getBlogFromHistoryByTitle(userEmail: string, title: string): BlogHistory | null {
    const history = this.historyMap[userEmail] || [];
    return history.find(h => h.blog.title === title) || null;
  }

  getBlogsByCategory(email: string, categoryId: string): Observable<BlogHistory[]> {
    return this.http.get<BlogHistory[]>(`${this.url}/history/blogs?email=${email}&categoryId=${categoryId}`);
  }

  getBlogsByCategoryAndDates(email: string, categoryId: string, fromDate: string, toDate: string): Observable<BlogHistory[]> {
    return this.http.get<BlogHistory[]>(`${this.url}/history/by-category?email=${email}&categoryId=${categoryId}&fromDate=${fromDate}&toDate=${toDate}`);
  }

  
  

}
