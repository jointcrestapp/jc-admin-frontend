import { Injectable, NgZone, inject } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, of } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  private isOnlineSubject = new BehaviorSubject<boolean>(true);
  public connectionChanges = this.isOnlineSubject.asObservable();

  private platformId = inject(PLATFORM_ID);
  private zone = inject(NgZone);

  constructor() {
    this.monitorNetwork();
  }

  private monitorNetwork() {
    if (!isPlatformBrowser(this.platformId)) return;

    const online$ = fromEvent(window, 'online').pipe(mapTo(true));
    const offline$ = fromEvent(window, 'offline').pipe(mapTo(false));

    merge(online$, offline$)
      .pipe(startWith(navigator.onLine))
      .subscribe((status) => {
        this.zone.run(() => this.isOnlineSubject.next(status));
      });
  }

  public isOnline(): boolean {
    return this.isOnlineSubject.value;
  }
}
