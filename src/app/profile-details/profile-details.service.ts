import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class ProfileDetailsService {

  

  constructor(private http: HttpClient) {  }


  getCountries () {
    return this.http.get('https://restcountries.eu/rest/v2/all').pipe(
      map((data: any)=>{
        return data;
      })
    );
  }

  getStates () {
    return this.http.get('https://gist.githubusercontent.com/ebaranov/41bf38fdb1a2cb19a781/raw/fb097a60427717b262d5058633590749f366bd80/gistfile1.json').pipe(
      map((data: any)=>{
        return data;
      })
    );
  }

  // updateUserDetails(data) {
  //   return this.database.put(data);
  // }
}