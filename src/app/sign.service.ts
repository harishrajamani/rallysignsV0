import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignService {

  constructor(
    private http: HttpClient
  ) { }

  // Observable signs source.
  private signsUpdatedSource = new Subject<Object>();

  // Observable signs stream.
  signsUpdated$ = this.signsUpdatedSource.asObservable();

  updateSigns(query) {
    this.http.get('/assets/signs.json').subscribe(data => {
      if (query) {
        // TODO(harishr): Replace with JsonPath
        for (const x in data) {
          if (!JSON.stringify(data[x]).toLowerCase().includes(query.toLowerCase())) {
            delete data[x];
          }
        }
      }
      this.signsUpdatedSource.next(data);
    })
  }
}
