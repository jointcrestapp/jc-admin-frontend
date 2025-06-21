import { appConfig } from "../config/config";
import { formatDate } from "@angular/common";
import { AbstractControl, ValidationErrors } from '@angular/forms';
// const yourhandle = require('countrycitystatejson');

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
    fileExtensionValidator(allowedExtensions: string[]): (control: AbstractControl) => ValidationErrors | null {
        return (control: AbstractControl): ValidationErrors | null => {
            const file = control.value;
            if (file && file.name) {
            const extension = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(extension)) {
                return { fileExtension: true };
            }
            }
            return null;
        };
    },
    getLocalUserData() {
        let getJSON = localStorage.getItem(appConfig.storage.USER_DATA);
        if (getJSON){
            let received = JSON.parse(getJSON)
            return received.data;
        }
    },
    SetLocalUserData(user:any){
        localStorage.setItem(appConfig.storage.USER_DATA,JSON.stringify(user));
    },
    getCartItems() {
        let getJSON = localStorage.getItem('cartItems');
        if (getJSON){
            let received = JSON.parse(getJSON)
            return received;
        }
    }
    ,
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
 
    //timeZoneAbrreviation of any location
    anyTimeZoneAbrreviation(long_tz:any){
        const zone:any = long_tz;     // return Zone object 
        return zone.abbr(new Date().getTime()) 
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
        let d = new Date(); // or whatever date you have
      //  let tzName = d.toLocaleString('en', {timeZoneName:'short'}).//split(' ').pop();
        //let tzName = d.toTimeString()
      //  return tzName;
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
    generateEntryCode() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";  
        for (var i = 0; i < 4; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
          return text;
    },
    randomDigits(){
        return Math.floor(100000 + Math.random() * 900000);
    },

    genrateMemberId(){
        return Math.floor(10000000 + Math.random() * 90000000);
    },
   
    generateOrderNumber() {
        let order_no = "";
        let possible = "0123456789";  
        for (let i = 0; i < 8; i++)
        order_no += possible.charAt(Math.floor(Math.random() * possible.length));
          return order_no;
    },
    todayDate(){
        //yyyy-mm-dd format
        let formatedDate = new Date().toISOString().slice(0, 10);
        return formatedDate;
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
/*
    getLocationWithoutCoordinates(){
        var requestUrl = "http://ip-api.com/json";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            success: function(json:any)
            {
                console.log('check::',JSON.parse(json));
                return JSON.parse(json);
            },
            error: function(err:any)
            {
                console.log("Request failed, error= " + err);
            }
        });
    },
*/
    getCookie(name: string) {
        let ca: Array<string> = document.cookie.split(';');
        let caLen: number = ca.length;
        let cookieName = `${name}=`;
        let c: string;

        for (let i: number = 0; i < caLen; i += 1) {
            c = ca[i].replace(/^\s+/g, '');
            if (c.indexOf(cookieName) == 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return '';
    },
    deleteCookie(name:string) {
        this.setCookie(name, '', -1);
    },

    setCookie(name: string, value: string, expireDays: number, path: string = '') {
        let d:Date = new Date();
        d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
        let expires:string = `expires=${d.toUTCString()}`;
        let cpath:string = path ? `; path=${path}` : '';
        document.cookie = `${name}=${value}; ${expires}${cpath}`;
    },

    selectWord(words:any) {
        var n = words.split(" ");
        return n[n.length - 1];
    
    },
    tokenExpired() {
        const token = parseInt(localStorage.getItem(appConfig.storage.TOKEN));
       // const expiry = (JSON.parse(atob(token.split('.')[1]))).expiresIn;
        return ((Math.floor((new Date).getTime() / 1000)) >= token) ? console.log('Valid Token') : this.router.navigate(['/login']);
    },
    containsNumber(str:string) {
        // Use a regular expression to search for digits (\d) in the string
        const regex = /\d/;
        return regex.test(str);
    },
    formatDate(inputDate:any){
        // Parse the input date string into a Date object
        const parsedDate = new Date(inputDate);
        // Format the Date object as "YYYY-MM-DD"
        const formattedDate = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getDate().toString().padStart(2, '0')}`;
        return formattedDate;
    },
    calculateAge(dateOfBirth:any){
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    },
    formattedTodayDate() {
        let date = new Date();
        let day:any = date.getDate();
        let month:any = date.getMonth() + 1; // Months are zero-based
        let year = date.getFullYear();
    
        // Pad day and month with leading zeros if they are single digits
        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;
    
        // Format the date as ddmmyyyy
        return day + month + year;
    },
    isTheAgeValid(inputDate: any) {
        // Parse the input date string into a Date object
        const parsedDate = new Date(inputDate);
        if (isNaN(parsedDate.getTime())) {
            return false; // Invalid date input
        }
    
        // Calculate age
        const today = new Date();
        let age = today.getFullYear() - parsedDate.getFullYear();
        const monthDiff = today.getMonth() - parsedDate.getMonth();
        const dayDiff = today.getDate() - parsedDate.getDate();
    
        // Adjust age if the birthday hasn't occurred this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
        console.log('Age::',age);
        // Return false if age is less than 18
        if (age < 18) {
            return false;
        }
    /*
        // Format the Date object as "YYYY-MM-DD"
        const formattedDate = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${parsedDate.getDate().toString().padStart(2, '0')}`;
    */
        return true;  
    },
    sortArrayByDate(groupedChats:any){
        const sortedDates = Object.keys(groupedChats).sort((a, b) => {
            // Convert dates to strings in YYYY-MM-DD format
            const dateA = new Date(a).toISOString().substr(0, 10);
            const dateB = new Date(b).toISOString().substr(0, 10);
          
            // Compare the date strings
            if (dateA > dateB) {
              return -1; // dateA comes before dateB
            } else if (dateA < dateB) {
              return 1; // dateA comes after dateB
            }
            return 0; // dates are equal
          });
          return sortedDates;
    },
    timeAgo(dateString:any) {
        const date:any = new Date(dateString);
        const now:any = new Date();
        const seconds = Math.floor((now - date) / 1000);
    
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };
    
        for (let key in intervals) {
            const interval = Math.floor(seconds / intervals[key]);
            if (interval > 0) {
                return `${interval} ${key}${interval !== 1 ? 's' : ''} ago`;
            }
        }
        return "just now";
    }  ,
    getFormattedDate(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
        if (diffDays === 0) {
            return 'Today';
        }
        else if (diffMinutes < 1) {
          return 'Just now';
        } else if (diffMinutes < 60) {
          return `${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
          return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffDays === 1) {
          return 'Yesterday';
        } 
        else if (diffDays < 7) {
          return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else {
          return formatDate(date, 'EEE, MMM d, yyyy', 'en-US'); // Regular date format
        }
    },
    firstLetterUpperCase(value: string): string {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
}
