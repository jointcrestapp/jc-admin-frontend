//let baseApiUrl = 'http://localhost:3100/api/v1';
let baseApiUrl = 'https://admindemoapi.jointcrest.africa/api/v1';
let SERVER_URL = 'http://localhost:3100';

let devUrl = 'http://localhost:4200';


export const environment = {
  production: false,
  SITE_URL: devUrl,
  SERVER_URL:SERVER_URL,
  apiURL : baseApiUrl,
  USER_PROFILE_PIC: `${SERVER_URL}/ProfileImages/`,
  //PHOTOS: `${SERVER_URL}/app-backend/public/dist/images/`,
  API_CRYPTO_KEY : '12345678901234567890123456789012', // 32 bytes
  API_CRYPTO_IV: '1234567890123456', // 16 bytes
  disableConsole:false,
  skipEncryption: true, // Flag to skip encryption in development mode
  PHOTOS: `${SERVER_URL}/images/`,
  URL: 'http://localhost:4200/assets/data', 
  storageURL: 'http://localhost:4200/assets',
};
