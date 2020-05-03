import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SignsService {
  constructor(
    private http: HttpClient
  ) { }

  getSigns() {
    return this.http.get('/assets/signs.json');
  }

  searchSigns(query) {
    return this.http.get('/assets/signs.json').pipe(map(data => {
      console.log(JSON.stringify(data));
      for (const x in data) {
        if (!JSON.stringify(data[x]).toLowerCase().includes(query.toLowerCase())) {
          delete data[x];
        }
      }
      return data;
    }), catchError(error => {
      return throwError('Something went wrong!');
    }))
  }


}
