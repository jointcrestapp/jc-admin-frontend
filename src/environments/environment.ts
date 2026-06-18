//et baseApiUrl = 'https://jointcrest.africa/api/v1';
 let baseApiUrl = 'https://admindemoapi.jointcrest.africa/api/v1';
let SERVER_URL = 'https://demoadmin.jointcrest.africa'; 

//0417
export const environment = {
  production: true,
  VERSION: '0.1.0',
  BUILD_DATE: '2026-03-02T12:00:00Z',
  SITE_URL: SERVER_URL,
  apiURL : baseApiUrl,
  USER_PROFILE_PIC: `${SERVER_URL}/ProfileImages/`,
  KYC_PHOTOS: `${SERVER_URL}/kyc/`,
  PRODUCT_IMAGES: `${SERVER_URL}/product-images/`,
  //PHOTOS: `${SERVER_URL}/app-backend/public/dist/images/`,
  API_CRYPTO_KEY : '12345678901234567890123456789012', // 32 bytes
  API_CRYPTO_IV: '1234567890123456', // 16 bytes
  disableConsole:false,
  skipEncryption: true, // Flag to skip encryption in development mode
  PHOTOS: `${SERVER_URL}/images/`,
  URL: SERVER_URL+'/assets/data', 
  storageURL: SERVER_URL+'/assets', 
};
