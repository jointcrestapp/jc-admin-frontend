import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CryptoService } from "./crypto.service";
import { environment } from "src/environments/environment.development";
import { BaseApiService } from "./base-api-service";
@Injectable({
  providedIn: "root",
})
export class MiscellaneousService extends BaseApiService {
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  getByeLaws(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_bye_laws`, filter);
  }

  addByeLaw(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_bye_law`, data);
  }

  updateByeLaw(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_bye_law/${id}`, data);
  }

  deleteByeLaw(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_bye_law/${id}`);
  }

  getMinutes(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_minutes`, filter);
  }

  addMinute(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_minute`, data);
  }

  updateMinute(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_minute/${id}`, data);
  }

  deleteMinute(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_minute/${id}`);
  }

  getTrainingSeminar(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_training_seminars`, filter);
  }

  addTrainingSeminar(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_training_seminar`, data);
  }

  updateTrainingSeminar(data: any, id: number): Observable<any> {
    return this.put(
      `${environment.apiURL}/update_training_seminar/${id}`,
      data
    );
  }

  deleteTrainingSeminar(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_training_seminar/${id}`);
  }
}
