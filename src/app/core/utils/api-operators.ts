// api-operators.ts
import { Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, retry, shareReplay, timeout } from 'rxjs/operators';

import { ErrorHandlerService } from '../services/error-handler.service';
import { appConfig } from '../config/config';

export function apiOperators(errorHandler: ErrorHandlerService) {
    
  return (source: Observable<any>) =>
    source.pipe(
      timeout(120000), // 120 seconds timeout
      retry(appConfig.API.RETRY), // Retry failed requests twice
      debounceTime(appConfig.API.DEBOUNCE_TIMEOUT), // Delay API calls slightly to prevent spam
      distinctUntilChanged(), // Avoid duplicate calls
      shareReplay(appConfig.API.CACHE_LATEST_RESP), // Cache latest response to optimize performance
      catchError((error) => {
        errorHandler.handleError(error); // Handle errors globally
        throw error; // Rethrow the error after handling
      })
    );
}
