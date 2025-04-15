let baseApiUrl = 'http://localhost:3100/api/v1';
let SERVER_URL = 'http://localhost:3100';
let devUrl = 'http://localhost:4200';


export const environment = {
  production: false,
  SITE_URL: devUrl,
  apiURL : baseApiUrl,
  USER_PROFILE_PIC: `${SERVER_URL}/ProfileImages/`,
  //PHOTOS: `${SERVER_URL}/app-backend/public/dist/images/`,
  KEY : '12345678901234567890123456789012', // 32 bytes
  IV: '1234567890123456', // 16 bytes
  skipEncryption: true, // Flag to skip encryption in development mode
  PHOTOS: `${SERVER_URL}/images/`,
  URL: 'http://localhost:4200/assets/data', // Change only the domain part, keeping "/api/admin" intact
  storageURL: 'http://localhost:4200/assets', // Change only the laravel primary domain
};
