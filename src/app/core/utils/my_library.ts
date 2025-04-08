import { appConfig } from "../config/config";
let tzlookup = require("tz-lookup");

let supportedAfricanCurrencies:any =[ 
    {
        "symbol": "₦",
        "code": "NGN"
    },
    {
        "symbol": "GH₵",
        "code": "GHS"
    },
    {
        "symbol": "R",
        "code": "ZAR"
    },
    {
        "symbol": "Ksh",
        "code": "KES"
    }
]
export const GLOBALF = {
    
    findInvalidControls(form_controls:any) {
        const invalid = [];
        const controls = form_controls;
        for (const name in controls) {
            if (controls[name].invalid && name != "phone") {
                invalid.push(name);
            }
        }
        console.log('INVALID FIELD::',invalid);
    },
    getLocalUserData() {
        let getJSON = localStorage.getItem(appConfig.storage.USER_DATA);
        if (getJSON){
            let received = JSON.parse(getJSON)
            return received.data;
        }
    },
    getEventSearchSuggestions(query:string,limit:number) {
        let getJSON = localStorage.getItem(appConfig.storage.EVENTS_DATA);
        if (getJSON){
            let received = [];
            received = JSON.parse(getJSON);
            received.filter((a:any) =>{

            })

            return received;
        }
    },
    randomToken() {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < 8; i++ ) {
          result += characters.charAt(Math.floor(Math.random()*charactersLength));
        }
        return result;
    },
     //timeZone based on offset of the select location from google field
    timeZone(offset:any){
        let _offset = offset/60;
        return "UTC"+_offset; //e.g. +1 this is based on the location selected from the google location drop down.

    },
    //Time zone selected from the location field
    selectedTimezone(lat:any, long:any){
        let selected_timezone = tzlookup(lat, long); //e.g. "America/New_York"
        return selected_timezone;
    },
    selectedTimezoneAbbrev(longTimezone:string){
        const date = new Date().toLocaleTimeString('en-US', { timeZone: longTimezone, timeZoneName: 'short' });
        const shortTimezone = date.split(' ')[2];
        return shortTimezone;
    },
    
    //timeZoneAbrreviation of current location
    timeZoneAbrreviation(){
        var zone = new Date().toLocaleTimeString(undefined,{timeZoneName:'short'}).split(' ')[2]
        return zone;        //standard world timezone e.g. GMT+1
    },

    //currentLocationOffset of current location
    currentLocationOffset() {
        let date = new Date();  
        let offset = date.getTimezoneOffset();
        return offset; // this is based on current location timezone
    },
    //timeZoneLocale of current location
    timeZoneLocale(){
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return timezone; //e.g. Africa/Lagos
    },
    ValidateEmail(input:string) {
        let validRegex = /^[A-Za-z0-9._+\-\']+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
      
        if (input.match(validRegex)) {
          return true;
      
        } else {   
          return false;
      
        }   
    },
    generateRefCode() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";  
        for (var i = 0; i < 6; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
          //let radar =  'radar';
          return text;
    },
    randomDigits(){
        return Math.floor(100000 + Math.random() * 900000);
    },
    autoReferralCode(){
        let characters = 'abcdefghijklmnopqrstuvwxyz0123456789'.toUpperCase();
        let result = ""
        let charactersLength = characters.length;

        for ( var i = 0; i < 5 ; i++ ) 
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            return result;
        
    },
    generateOrderNumber() {
        let order_no = "";
        let possible = "0123456789";  
        for (let i = 0; i < 8; i++)
        order_no += possible.charAt(Math.floor(Math.random() * possible.length));
          return order_no;
    },
    currentTime(){
        let d = new Date();
        let formattedTime = d.toLocaleTimeString('en-US', { hour12: true });
        return formattedTime;
    },
    currentWeekNumber(){
        let currentDate:any = new Date();
        let startDate:any = new Date(currentDate.getFullYear(), 0, 1);
         let days = Math.floor((currentDate - startDate) /
             (24 * 60 * 60 * 1000));
              
         var weekNumber = Math.ceil(days / 7);
         return weekNumber;
    },
    getWeekofSpecificDate(date:string){
        let currentDate:any = new Date(date);
        let startDate:any = new Date(currentDate.getFullYear(), 0, 1);
         let days = Math.floor((currentDate - startDate) /
             (24 * 60 * 60 * 1000));
              
         var weekNumber = Math.ceil(days / 7);
            
        /// console.log("Week number of " + currentDate +
        //     " is :   " + weekNumber);
        return weekNumber;
    },
    isNumberOnly(data:any){
        let isNumber = /^\d+$/.test(data);
        return isNumber;

    },
    //get the first two word in the comma separated string
    getFirstWordInString(str:any){
        let pos = str.indexOf( ',' );
        return str.substring( 0, pos );
    },
    filterLikeStrings(statement:any,filter_texts:any) {
          let re = new RegExp(filter_texts, 'gi');
          let res = statement.match(re);
          return res;
    },
    capitalizeFirstLetter(str:any){
          //split the above string into an array of strings 
          //whenever a blank space is encountered
  
          const arr = str.split(" ");
  
          //loop through each element of the array and capitalize the first letter.
          for (var i = 0; i < arr.length; i++) {
              arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  
          }
          //Join all the elements of the array back into a string 
          //using a blankspace as a separator 
          const str2 = arr.join(" ");
          return str2;
    },
    firstLetterUpperCase(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
    },

    todayDate(){
        //yyyy-mm-dd format
        let formatedDate = new Date().toISOString().slice(0, 10);
        return formatedDate;
      },
      todayDate2(){
          let currentDate = new Date().toJSON().slice(0, 10);
          return currentDate; //e.g. "2022-06-17"
      },
      formatDate(customDate:any){
          let formattedDate = customDate.toJSON().slice(0, 10);
         // console.log('formattedDate::',formattedDate);
          return formattedDate; //e.g. "2022-06-17"
      },
      nextWeek(){
          let now = new Date();
          let nextWeek = new Date(new Date(now).setDate(now.getDate() + 7)).toJSON().slice(0, 10);
          return nextWeek;
      },
      nextTwoWeeks(){
          let now = new Date();
          let nextTwoWeeks = new Date(new Date(now).setDate(now.getDate() + 14)).toJSON().slice(0, 10);
          return nextTwoWeeks;
      },
      nextThreeWeeks(){
          let now = new Date();
          let nextThreeWeeks = new Date(new Date(now).setDate(now.getDate() + 21)).toJSON().slice(0, 10);
          return nextThreeWeeks;
      },
      oneWeekAgo(){
          let now = new Date();
          let oneWeekAgo = new Date(new Date(now).setDate(now.getDate() - 7)).toJSON().slice(0, 10);
          return oneWeekAgo;
      },
      twoWeeksAgo(){
          let now = new Date();
          let twoWeeksAgo = new Date(new Date(now).setDate(now.getDate() - 14)).toJSON().slice(0, 10);
          return twoWeeksAgo;
      },
      threeWeeksAgo(){
          let now = new Date();
          let threeWeeksAgo = new Date(new Date(now).setDate(now.getDate() - 21)).toJSON().slice(0, 10);
          return threeWeeksAgo;
      },
      nextMonth(){
          let now = new Date();
          let nextMonth = new Date(new Date(now).setMonth(now.getMonth() + 1)).toJSON().slice(0, 10);
          return nextMonth;
      },
      nextTwoMonths(){
          let now = new Date();
          let nextMonth = new Date(new Date(now).setMonth(now.getMonth() + 2)).toJSON().slice(0, 10);
          return nextMonth;
      },
      nextThreeMonths(){
          let now = new Date();
          let nextMonth = new Date(new Date(now).setMonth(now.getMonth() + 3)).toJSON().slice(0, 10);
          return nextMonth;
      },
      oneMonthAgo(){
          let now = new Date();
          let prevMonth = new Date(new Date(now).setMonth(now.getMonth() - 1)).toJSON().slice(0, 10);
          return prevMonth;
      },
      twoMonthsAgo(){
          let now = new Date();
          let prevMonth = new Date(new Date(now).setMonth(now.getMonth() - 2)).toJSON().slice(0, 10);
          return prevMonth;
      },
      threeMonthsAgo(){
          let now = new Date();
          let prevMonth = new Date(new Date(now).setMonth(now.getMonth() - 3)).toJSON().slice(0, 10);
          return prevMonth;
      },
      setCookie(name:any, value:any, expirationDays:any) {
        const date = new Date();
        date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        return  document.cookie = name + "=" + value + "; " + expires + "; path=/";
      },
      getCookie(name:any) {
        const cookieName = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
          let cookie = cookieArray[i];
          while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
          }
          if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
          }
        }
        return null;
      },
      isLocalStorageSupported() {
        try {
          const testKey = "__test__";
          localStorage.setItem(testKey, testKey);
          localStorage.removeItem(testKey);
          return true;
        } catch (e) {
          return false;
        }
      },
      areCookiesSupported() {
        try {
          const testCookieName = "__test__";
          document.cookie = testCookieName + "=1";
          const cookieValue = document.cookie.indexOf(testCookieName) !== -1;
          document.cookie = testCookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          return cookieValue;
        } catch (e) {
          return false;
        }
      },
      // Function to convert a specific time to the time in any country
      convertCustomTimeToCountryTime(timeString:any, sourceTimeZone:any, targetTimeZone:any) {
        //timeString = '3:00 PM'; // Replace this with the time you want to convert
        //sourceTimeZone = 'America/New_York'; // Replace with the source timezone of the given time
        //targetTimeZone = 'Asia/Tokyo'; // Replace with the target timezone you want
        const sourceDateTimeString = `2000-01-01 ${timeString}`; // Assuming a date for conversion, you can change this if needed
        const sourceDateTime = new Date(sourceDateTimeString);
        const options = {
           
            hour12: true,
            timeZone: targetTimeZone,
          };
        // Convert the source time to the target timezone
        const targetDateTimeString = sourceDateTime.toLocaleString('en-US',options);
        
        // Extract the time portion only
        const targetTime = targetDateTimeString.split(', ')[1];
        
        return targetTime;
      },
      // Function to convert current time with a source timezone to another time and target timezone
      convertCurrentTimeToTimeZone(sourceTimeZone:any, targetTimeZone:any) {
            //sourceTimeZone = 'America/New_York'; // Replace with the source timezone you want
            //targetTimeZone = 'Asia/Tokyo'; // Replace with the target timezone you want
            // Get the current date and time in the source timezone
            const currentTime = new Date();
            const sourceTime = currentTime.toLocaleString('en-US', { timeZone: sourceTimeZone });
            
            // Extract components of the source time
            const { day, month, year, hour, minute, second } = Object.fromEntries(
            new Intl.DateTimeFormat('en-US', {
                timeZone: sourceTimeZone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }).formatToParts(currentTime)
            .map(({ type, value }) => [type, parseInt(value, 10)])
            );
            
            // Create a new date object with the source timezone components
            const sourceDateTime = new Date(year, month - 1, day, hour, minute, second);
            
            // Convert the source time to the target timezone
            const targetDateTime = new Date(sourceDateTime.toLocaleString('en-US', { timeZone: targetTimeZone }));
    
            // Return the converted time in the target timezone
            return targetDateTime.toLocaleString('en-US', { timeZone: targetTimeZone });
  },
  selectWord(N:any){
    var v=N.split(" ");
    return v[v.length-1];
  },

  isTimeLessThanCurrentTime(timeString:any) {
    // Create a Date object for the given time
    const givenTime = new Date(`2000-01-01 ${timeString}`);
    // Get the current time
    const currentTime = new Date();
    // Compare the given time with the current time
    return givenTime < currentTime;
  },

  getToken(){
    return localStorage.getItem(appConfig.storage.TOKEN);
  },

  saveOTPToken(t:any){
    return localStorage.setItem(appConfig.storage.OTP_TOKEN,t);
  },
  getOTPToken(){
    return localStorage.getItem(appConfig.storage.OTP_TOKEN);
  },

  isTokenExpired() {
    const token:any = this.getToken();
    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode the payload
        const exp = payload.exp; // Expiry timestamp in seconds
        
        if (!exp) {
            throw new Error("Token does not have an expiration field.");
        }
        
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        return currentTime > exp; // Returns true if expired, false otherwise
    } catch (error) {
        console.error("Invalid token:", error);
        return true; // Consider invalid tokens as expired
    }
  },
  isOTPTokenExpired() {
    const token:any = this.getOTPToken();
    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode the payload
        const exp = payload.exp; // Expiry timestamp in seconds
        
        if (!exp) {
            throw new Error("Token does not have an expiration field.");
        }
        
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        return currentTime > exp; // Returns true if expired, false otherwise
    } catch (error) {
        console.error("Invalid token:", error);
        return true; // Consider invalid tokens as expired
    }
  },
  getLocation(){
    navigator.geolocation?navigator.geolocation.getCurrentPosition(this.showPosition):
    alert("Geolocation is not supported by this browser.")
  },
  
formatNameWithDash(name:any){
    const formattedName = name?.replace(/\s+/g, "-"); 
    return formattedName;
},
stripHtmlTags(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  },
  formatToShortDate(dateString: string): string {
    const date = new Date(dateString); 
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    });
  }
  
  // Example Usage
  //'Mon Feb 24 2025 01:00:00 GMT+0100');
  // Output: "Mon, Feb 24, 2025"
  
}

