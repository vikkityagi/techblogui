import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from './model/category.model';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) { }

  addCategory(category: Category): Observable<Category> {
    return this.httpClient.post<Category>(`${this.apiUrl}/categories`, category);
  }

  getAllCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`${this.apiUrl}/categories`);
  }
}
