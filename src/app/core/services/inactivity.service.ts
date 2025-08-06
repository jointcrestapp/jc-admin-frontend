import { inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { appConfig } from '../config/config';
import { AuthService } from './auth.service';

import { Store } from '@ngxs/store';
import { Logout } from 'src/app/shared/store/action/auth.action';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class InactivityService {
  private timeoutId: any;
  private readonly timeoutDuration = appConfig.INACTIVITY_TIMER['10MINS']
  private platformId = inject(PLATFORM_ID);
  
    constructor(private ngZone: NgZone,
      private store: Store
  ) {
    this.initListener();
    this.resetTimer();
  }

  initListener() {
    if (!isPlatformBrowser(this.platformId)) return;
        console.log('Inactivity');
    ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, () => this.resetTimer());
    });
  }

  resetTimer() {
    clearTimeout(this.timeoutId);
    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => {
        this.ngZone.run(() => {
          this.store.dispatch(new Logout());
        });
      }, this.timeoutDuration);
    });
  }

}
