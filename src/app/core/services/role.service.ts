import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { CryptoService } from '../../core//services/crypto.service';
import { environment } from 'src/environments/environment.development';
import { BaseApiService } from './base-api-service';
@Injectable({
  providedIn: 'root',
})
export class  RleService extends BaseApiService {
  
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  addRole(data: any) : Observable<any> {
    return this.post(`${environment.apiURL}/add_role`, data);
  }

  getRoles(data: any) : Observable<any> {
    return this.get(`${environment.apiURL}/get_roles`, data);
  }

  getRoleModules(): Observable<any> {
    return this.get(`${environment.apiURL}/get_role_modules`);
  }

  updateRole(data: any, id: number) : Observable<any> {
    return this.put(`${environment.apiURL}/update_role/${id}`, data);
  }

  deleteRole(id:number) : Observable<any> {
    return this.delete(`${environment.apiURL}/delete_role/${id}`);
  }

  deleteMultipleRoles(data: any) : Observable<any> {
    return this.post(`${environment.apiURL}/delete_multiple_roles`, data)
  }

}
