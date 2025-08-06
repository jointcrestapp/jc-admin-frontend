let baseApiUrl = 'https://jointcrest.org/api/v1';
let SERVER_URL = 'https://jointcrest.org';

export const environment = {
  production: true,
  SITE_URL: SERVER_URL,
  apiURL : baseApiUrl,
  USER_PROFILE_PIC: `${SERVER_URL}/ProfileImages/`,
  //PHOTOS: `${SERVER_URL}/app-backend/public/dist/images/`,
  API_CRYPTO_KEY : '12345678901234567890123456789012', // 32 bytes
  API_CRYPTO_IV: '1234567890123456', // 16 bytes
  disableConsole:false,
  skipEncryption: true, // Flag to skip encryption in development mode
  PHOTOS: `${SERVER_URL}/images/`,
  URL: SERVER_URL+'/assets/data', 
  storageURL: SERVER_URL+'/assets', 
};
