import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { CryptoService } from './crypto.service';
import { environment } from 'src/environments/environment.development';
import { BaseApiService } from './base-api-service';
@Injectable({
  providedIn: 'root',
})
export class  SharesService extends BaseApiService {
  
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  getShares(filter: any) : Observable<any>{
    return this.get(`${environment.apiURL}/get_shares_history`, filter);
  }

  addShares(data: any) : Observable<any> {
    return this.post(`${environment.apiURL}/add_shares`, data);
  }

  getSharesById(id: string) : Observable<any> {
    return this.get(`${environment.apiURL}/get_shares_by_id/${id}`);
  }

  getFilteredMember(filter: any) : Observable<any> {
    return this.get(`${environment.apiURL}/get_filtered_members`, filter);
  }

  updateShares(data: any, id: number) : Observable<any> {
    return this.put(`${environment.apiURL}/update_shares/${id}`, data);
  }
  updateUserSharesStatus(data: any) : Observable<any> {
    return this.post(`${environment.apiURL}/update_shares_status`, data);
  }

  deleteShares(id:number) : Observable<any> {
    return this.delete(`${environment.apiURL}/delete_share/${id}`);
  }

  searchForShares(data: any): Observable<any> {
    return this.http.post(environment.apiURL+ '/search_for_shares', data)
  }

}
