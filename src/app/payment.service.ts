import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { Logger } from 'src/logger/logger';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly url = environment.apiBaseUrl;
  private logger = Logger;

  constructor(private http: HttpClient) { }

  getPaymentDetails() {
    return this.http.get<any>(`${this.url}/payments/details`);
  }

  getTransactionStatus(txnId: string) {
    return this.http.get<any>(`${this.url}/payments/status/${txnId}`);
  }
}
