import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private SECRET_KEY = environment.API_CRYPTO_KEY;
  private IV = environment.API_CRYPTO_IV

  constructor() {}

  encrypt(data: any): string {
     if (environment.skipEncryption) {
      console.log('Encryption skipped in development mode.');
      return data; // Skip encryption if flag is true
    }
    const key = CryptoJS.enc.Utf8.parse(this.SECRET_KEY);
      const iv = CryptoJS.enc.Utf8.parse(this.IV);

      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      return encrypted.toString();
  }

  decrypt(cipherText: string): any {
     if (environment.skipEncryption) {
      console.log('Encryption skipped in development mode.');
      return JSON.parse(cipherText);
    }
    
    const key = CryptoJS.enc.Utf8.parse(this.SECRET_KEY);
    const iv = CryptoJS.enc.Utf8.parse(this.IV);
    const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));        
  }

    decodeJWT(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid JWT:', error);
      return null;
    }
  }
}


