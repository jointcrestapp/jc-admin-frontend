import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { CryptoService } from '../../core//services/crypto.service';
import { environment } from 'src/environments/environment.development';
import { BaseApiService } from './base-api-service';
@Injectable({
  providedIn: 'root',
})
export class  ThriftsService extends BaseApiService {
  
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  getThrifts(filter: any) : Observable<any>{
    return this.get(`${environment.apiURL}/get_thrifts_history`, filter);
  }

  getActiveThriftForUser(filter: any) : Observable<any>{
    return this.get(`${environment.apiURL}/get_active_thrift_for_user`, filter);
  }

  addThrifts(data: any) : Observable<any> {
    return this.post(`${environment.apiURL}/add_thrifts`, data);
  }

  getThriftsById(id: string) : Observable<any> {
    return this.get(`${environment.apiURL}/get_thrifts_by_id/${id}`);
  }

  getFilteredMember(filter: any) : Observable<any> {
    return this.get(`${environment.apiURL}/get_filtered_members`, filter);
  }

  getThriftsTiers(filter: any) : Observable<any> {
    return this.get(`${environment.apiURL}/get_thrifts_tiers`, filter);
  }

  updateThrifts(data: any, id: number) : Observable<any> {
    return this.put(`${environment.apiURL}/update_thrifts/${id}`, data);
  }
  updateUserThriftsStatus(data: any) : Observable<any> {
    return this.post(`${environment.apiURL}/update_thrifts_status`, data);
  }

  deleteThrifts(id:number) : Observable<any> {
    return this.delete(`${environment.apiURL}/delete_thrift/${id}`);
  }

  searchForThrifts(data: any): Observable<any> {
    return this.http.post(environment.apiURL+ '/search_for_thrifts', data)
  }

}
