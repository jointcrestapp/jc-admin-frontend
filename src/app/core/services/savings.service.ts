import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { CryptoService } from '../../core//services/crypto.service';
import { environment } from 'src/environments/environment.development';
import { BaseApiService } from './base-api-service';
@Injectable({
  providedIn: 'root',
})
export class  SavingsService extends BaseApiService {
  
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  getSavings(filter: any) : Observable<any>{
    return this.post(`${environment.apiURL}/get_savings_history`, filter);
  }

  addSavings(data: any) : Observable<any> {
    return this.post(`${environment.apiURL}/add_savings`, data);
  }

  getSavingsById(id: string) : Observable<any> {
    return this.get(`${environment.apiURL}/get_savings_by_id/${id}`);
  }

  updateSavings(data: any) : Observable<any> {
    return this.post(`${environment.apiURL}/update_savings`, data);
  }
  updateUserSavingsStatus(data: any) : Observable<any> {
    return this.post(`${environment.apiURL}/update_savings_status`, data);
  }

  searchForSavings(data: any): Observable<any> {
    return this.http.post(environment.apiURL+ '/search_for_savings', data)
  }

}
