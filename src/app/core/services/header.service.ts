import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { appConfig } from '../config/config';


@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private headerSubject = new BehaviorSubject<any>(this.loadHeader());
  header$ = this.headerSubject.asObservable();

  constructor() {}

  private loadHeader() {
    const storedHeader = localStorage.getItem(appConfig.storage.HEADER);
    return storedHeader ? JSON.parse(storedHeader) : this.generateHeader();
  }

  private generateHeader() {
    console.log('Token:::',localStorage.getItem(appConfig.storage.TOKEN));
    const headers:any = {
        'Origin': window.location.origin,
        'Url': window.location.href,
        'Authorization': localStorage.getItem(appConfig.storage.TOKEN),
        'Expiry': localStorage.getItem(appConfig.storage.TOKEN_EXPIRY),
        'Long': localStorage.getItem(appConfig.storage.USER_LONGITUDE),
        'Lat': localStorage.getItem(appConfig.storage.USER_LATITUDE),
        'Timezone': localStorage.getItem(appConfig.storage.SHORT_TIMEZONE),
        'Country': localStorage.getItem(appConfig.storage.USER_CURRENT_COUNTRY),
        'CountryCode': localStorage.getItem(appConfig.storage.USER_CURRENT_COUNTRYCODE),
        'State': localStorage.getItem(appConfig.storage.USER_CURRENT_LONG_STATE),
        'City': localStorage.getItem(appConfig.storage.USER_CURRENT_CITY),
      };
   
    localStorage.setItem(appConfig.storage.HEADER, JSON.stringify(headers));
    return headers;
  }

  updateHeader() {
    const newHeader = this.generateHeader();
    this.headerSubject.next(newHeader);
  }

  getHeader() {
    return this.headerSubject.getValue();
  }
}
