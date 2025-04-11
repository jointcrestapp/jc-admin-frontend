import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, TimeoutError } from 'rxjs';
import { appConfig } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() {}

  /** Handles different HTTP errors */
  handleError(error: any) {
    
    let errorMessage = 'An unknown error occurred. Please try again.';

    if (error instanceof TimeoutError) {
      errorMessage = 'Request timed out. Please check your internet connection.';
    } else if (error instanceof HttpErrorResponse) {
        console.log('err::',error)
      if (error.status === 0) {
        errorMessage = 'Something went wrong.';
      } else if (error.status === appConfig.statusCode.badRequest) {
        errorMessage = 'Bad request. Please check your input and try again.';
      } else if (error.status === appConfig.statusCode.unauthorized) {
        errorMessage = 'Unauthorized access. Please log in again.';
      } else if (error.status === appConfig.statusCode.forbidden) {
        errorMessage = 'Access denied. You do not have permission.';
      } else if (error.status === appConfig.statusCode.notFound) {
        errorMessage = 'Requested resource not found.';
      } else if (error.status === appConfig.statusCode.requestTimeout) {
        errorMessage = 'Request timed out. Please try again.';
      }
       else if (error.status === appConfig.statusCode.accountDeactivated) {
        errorMessage = 'You are not authorized to access this account. Kindly send an email to askti@radarhostapp.com for reactivation..';
      }
      else if (error.status === appConfig.statusCode.tooManyRequests) {
        errorMessage = 'Too many requests. Please wait and try again later.';
      } else if (error.status >= appConfig.statusCode.internalServerError) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = error.statusText;
      }
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Network timeout. Please try again.';
    }

    // Display error using Toastr
    alert(errorMessage);

    // Return an observable with a user-friendly error message
    return throwError(() => new Error(errorMessage));
  }
}
