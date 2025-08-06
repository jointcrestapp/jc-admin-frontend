import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';


@Injectable({ providedIn: 'root' })
export class ConsoleToggleService {
  constructor() {}

    disableConsole(): void {
      
    if (environment.disableConsole) {
      console.warn('Console output is disabled.');
      console.log = () => {};
      console.debug = () => {};
      console.info = () => {};
      console.warn = () => {};
      console.error = () => {};
    }
  }
}
