import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiOperators } from '../utils/api-operators';
import { environment } from 'src/environments/environment.development';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
    constructor(protected http: HttpClient, protected crypto: CryptoService) { }
    
   protected encryptIfNeeded(data: any): any {
    return environment.skipEncryption ? data : { data: this.crypto.encrypt(data) };
  }

  get<T>(url: string, params?: any, headers?: HttpHeaders) {
    return this.http.get<T>(url, { params, headers }).pipe(apiOperators());
  }

  post<T>(url: string, body: any, headers?: HttpHeaders) {
    return this.http.post<T>(url, this.encryptIfNeeded(body), { headers }).pipe(apiOperators());
  }

  put<T>(url: string, body: any, headers?: HttpHeaders) {
    return this.http.put<T>(url, this.encryptIfNeeded(body), { headers }).pipe(apiOperators());
  }

  patch<T>(url: string, headers?: HttpHeaders) {
    return this.http.patch<T>(url, { headers }).pipe(apiOperators());
  }

  delete<T>(url: string, headers?: HttpHeaders) {
    return this.http.delete<T>(url, { headers }).pipe(apiOperators());
  }
}
