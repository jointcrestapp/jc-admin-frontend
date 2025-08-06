import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, of } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public connectionChanges = this.isOnlineSubject.asObservable();

  constructor(private zone: NgZone) {
    this.monitorNetwork();
  }

  private monitorNetwork() {
    merge(
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    )
    .pipe(startWith(navigator.onLine))
    .subscribe(status => {
      this.zone.run(() => this.isOnlineSubject.next(status));
    });
  }

  public isOnline(): boolean {
    return this.isOnlineSubject.value;
  }
}
