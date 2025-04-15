// rxjs-operators.ts
import {
  debounceTime,
  distinctUntilChanged,
  timeout,
  retry,
  catchError,
  finalize,
  shareReplay
} from 'rxjs/operators';
import { timer, throwError, Observable } from 'rxjs';

/**
 * Reusable API pipe operators for clean and consistent request handling.
 *debounce, distinctUntilChanged, timeout, retry with delay,
 * global error handling, and shareReplay for response caching.
 */
export function apiOperators<T>({
  debounceMs = 300,
  timeoutMs = 10000,
  retryCount = 2,
  retryDelayMs = 1000,
  logErrors = true,
  logRetries = true,
  enableReplay = true,
} = {}) {
  return (source$: Observable<T>) => {
    let piped$ = source$.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
      timeout(timeoutMs),
      retry({
        count: retryCount,
        delay: (error, retryAttempt) => {
          if (logRetries) {
            console.warn(`Retry attempt [${retryAttempt}] after failure:`, error?.message || error);
          }
          return timer(retryDelayMs);
        }
      }),
      catchError((error) => {
        if (logErrors) {
          if (error?.name === 'TimeoutError') {
            console.error('Request timed out');
          } else {
            console.error('API call failed:', error);
          }
        }
        return throwError(() => error);
      }),
      finalize(() => console.log('Request complete'))
    );

    if (enableReplay) {
      piped$ = piped$.pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }

    return piped$;
  };
}

