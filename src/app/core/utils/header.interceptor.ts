import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeaderService } from './../../core/services/header.service';

@Injectable()
export class PayloadInterceptor implements HttpInterceptor {
  constructor(private headerService: HeaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Step 1: Get the current payload (body) if it exists
    const payload = req.body;

    // Step 2: Get the headers from the HeaderService (if you need them)
    const headers = this.headerService.getHeader();

    // Step 3: Rebuild the payload by adding the extra data (e.g., headers)
    const modifiedPayload = payload
      ? { ...payload, header: headers } // Modify the payload, adding a 'header' property
      : { header: headers }; // If no payload, just add the header info in the body

    // Step 4: Clone the request and modify the body (payload)
    const clonedRequest = req.clone({
      body: modifiedPayload,  // Set the modified body
    });

    // Step 5: Forward the modified request to the next handler
    return next.handle(clonedRequest);
  }
}
