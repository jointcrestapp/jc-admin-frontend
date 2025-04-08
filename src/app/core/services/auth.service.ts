import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { appConfig } from '../config/config';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HeaderService } from './header.service';
import { ErrorHandlerService } from './error-handler.service';
import { apiOperators } from '../utils/api-operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAdminLoggedInSubject!: BehaviorSubject<any>;
  public getLoggedUser:any;
  public loggedInUser!: Observable<any>;


  isLoggedIn: boolean = false;
  //this to be completed later when the system is scaled up
  //then isAdminLoggedIn can be passed from here to the role guard class using BehaviourSubject or Observable
  isAdminLoggedIn: boolean = false;
  onLoggedOut: EventEmitter<boolean> = new EventEmitter();
  onLoggedIn: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient, private toastr:ToastrService, private router: Router,
    private headerService: HeaderService,
    private errorHandler: ErrorHandlerService
  ) { 
    
   
  }


  signUp(data: any): Observable<any> {
    console.log(data);
    return this.http.post(environment.apiURL + '/signup', data)
    .pipe(apiOperators(this.errorHandler)); // Pass the injected error handler)
  }

  login(data: any): Observable<any> {
    return this.http.post(environment.apiURL+ '/login.php', data)
    .pipe(
      apiOperators(this.errorHandler), // Use the custom operator
      map((response:any)=> {
        console.log('RESPONSE::', response); // Check if this logs anything
        
        if (!response) {
          console.error('Login API returned an empty response');
        }
      this.isLoggedIn = true;
      if(response.data){
        this.isAdminLoggedIn = response.data.role === 1 || response.data.role === 2 ? true : false;
        this.isAdminLoggedInSubject = new BehaviorSubject(this.isAdminLoggedIn);

        localStorage.setItem(appConfig.storage.IS_LOGGED_IN, JSON.stringify('true'));

        localStorage.setItem(appConfig.storage.USER_DATA, JSON.stringify(response));
        localStorage.setItem(appConfig.storage.TOKEN,response.token);
        localStorage.setItem(appConfig.storage.TOKEN_EXPIRY,response.expiry);
        this.headerService.updateHeader();
        if(data.remember){
          localStorage.setItem(appConfig.storage.REMEMBER_ME, data.remember);
        }
        console.log(response);
      }
      return response;
      
    }));
  }

  logoutUser() { 
    localStorage.removeItem(appConfig.storage.USER_DATA);
    localStorage.getItem(appConfig.storage.IS_LOGGED_IN);
    
    this.isLoggedIn = false;
  
    this.headerService.updateHeader(); // Update headers after logout
  }

  logOut(data: any): Observable<any> {
   
     return this.http.post(environment.apiURL+ '/logout', data) 
     .pipe(
      apiOperators(this.errorHandler), // Use the custom operator
      map((response:any)=> {
      console.log("logout::",response);
      if(response.status == appConfig.statusCode.ok){  }
      this.logoutUser(); 
       return response;
     }));
  }

    // Decode the JWT token to get the expiration time
    getToken(): string | null {
      return localStorage.getItem(appConfig.storage.TOKEN);
    }
  
    getTokenExpirationDate(token: string): Date | null {
      if (!token) {
        return null;
      }
  
      try {
        const decoded = this.decodeToken(token);
        if (decoded && decoded.exp) {
          return new Date(decoded.exp * 1000); // Convert from seconds to milliseconds
        }
      } catch (error) {
        console.error('Error decoding token', error);
      }
  
      return null;
    }
  
    isTokenExpired(tokenExpirationDate: Date | null): boolean {
      if (!tokenExpirationDate) {
        return true; // If no expiration date, consider it expired
      }
  
      return new Date() > tokenExpirationDate; // Check if the current time is after the expiration date
    }
  
    decodeToken(token: string): any {
      try {
        const payload = token.split('.')[1]; // JWT token is in the format: header.payload.signature
        const decoded = atob(payload); // Decode the base64-encoded payload
        return JSON.parse(decoded); // Return parsed JSON
      } catch (e) {
        console.error('Error decoding JWT token:', e);
        return null;
      }
    }

}