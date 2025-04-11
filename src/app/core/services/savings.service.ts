import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { appConfig } from '../config/config';
import { Router } from '@angular/router';
// import { HeaderService } from './header.service';
import { ErrorHandlerService } from './error-handler.service';
import { apiOperators } from '../utils/api-operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SavingsService {
  
  constructor(private http: HttpClient, 
    private router: Router,
    // private headerService: HeaderService,
    private errorHandler: ErrorHandlerService
  ) { 
    
   
  }


  

  allSavings(data: any): Observable<any> {
    return this.http.post(environment.apiURL+ '/get_savings_histories', data) 
     .pipe(
      apiOperators(this.errorHandler)
    );
  }

}