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
    //this.signs = this.http.get('/assets/signs.json').subscribe(data => {
    //  console.log("Query: " + query + " Data: " + data[0].id);
    //  delete data[0];
    //  this.signs = data;
    //})
    return this.http.get('/assets/signs.json').pipe(map(data => {
      //delete data[0];
      console.log(JSON.stringify(data));
      console.log(Object.getOwnPropertyNames(data));
      console.log("Data: "+ data[0].id + " " + data[1].id);
      console.log("More data: " + Object.getOwnPropertyNames(data[0]));
      console.log("Total: " + data['length']);
      //delete data[0];
      return data;
    }), catchError(error => {
      return throwError('Something went wrong!');
    }))
  }


}
