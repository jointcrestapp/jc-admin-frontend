import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private dataFolder = 'assets/data'; // folder containing JSON files
  private jsonFiles = ['file1.json', 'file2.json']; // list all your JSON files here

  constructor(private http: HttpClient) {}

  /**
   * Load all JSON files in the data folder
   */
  loadAllData(): Observable<{ [key: string]: any }> {
    const requests = this.jsonFiles.map(file =>
      this.http.get(`${this.dataFolder}/${file}`).pipe(
        map(data => ({ [file]: data }))
      )
    );

    return forkJoin(requests).pipe(
      map(results => Object.assign({}, ...results))
    );
  }

  /**
   * Load a single JSON file by name
   */
  loadData(fileName: string): Observable<any> {
    return this.http.get(`${this.dataFolder}/${fileName}`);
  }
}
