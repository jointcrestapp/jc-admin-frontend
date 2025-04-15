let baseApiUrl = 'https://jointcrest.org/api/v1';
let SERVER_URL = 'https://jointcrest.org';
let devUrl = 'https://jointcrest.org';


export const environment = {
  production: true,
  SITE_URL: devUrl,
  apiURL : baseApiUrl,
  USER_PROFILE_PIC: `${SERVER_URL}/ProfileImages/`,
  //PHOTOS: `${SERVER_URL}/app-backend/public/dist/images/`,
  KEY : '12345678901234567890123456789012', // 32 bytes
  IV: '1234567890123456', // 16 bytes
  skipEncryption: true, // Flag to skip encryption in development mode
  PHOTOS: `${SERVER_URL}/images/`,
  URL: 'https://jointcrest.org/assets/data', // Change only the domain part, keeping "/api/admin" intact
  storageURL: 'https://jointcrest.org/assets', // Change only the laravel primary domain
};
