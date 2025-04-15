// decrypt.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CryptoService } from '../services/crypto.service';


@Injectable()
export class DecryptInterceptor implements HttpInterceptor {
  constructor(private cryptoService: CryptoService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // Decrypt the response body if the response is successful
          if (event.body && event.body.encrypted) {
            event = event.clone({
              body: this.cryptoService.decrypt(event.body.encrypted)
            });
          }
        }
        return event;
      })
    );
  }
}
