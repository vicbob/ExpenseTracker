import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the AppconstantsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AppconstantsProvider {
   BASEURL:string = "localhost:5000";
   
  constructor(public http: HttpClient) {
    console.log('Hello AppconstantsProvider Provider');
  }

}
