import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CryptoService } from '../services/crypto.service';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class EncryptionInterceptor implements HttpInterceptor {
  constructor(private crypto: CryptoService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Define routes to exclude from encryption
    /* const EXCLUDED_ROUTES = ['/api/v1/upload_image'];

    // Check if the request URL matches any excluded route
    const shouldExclude = EXCLUDED_ROUTES.some(route => req.url.includes(route));

    // Skip encryption for excluded routes or if encryption is globally disabled
    if (shouldExclude || environment.skipEncryption) {
      return next.handle(req);
    }
 */
    // Proceed with encryption only if body exists and is an object
    if (req.body && typeof req.body === 'object') {
      const encrypted = this.crypto.encrypt(req.body);
      const modifiedReq = req.clone({
        body: { encrypted }
      });
      return next.handle(modifiedReq);
    }

    // Default fallback
    return next.handle(req);
  }
}
