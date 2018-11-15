import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AppConstantsProvider } from '../app-constants/app-constants';

/*
  Generated class for the UserActionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserActionsProvider {
  headers = new HttpHeaders();
  headersIsSet: boolean = false;

  constructor(public http: HttpClient, private storage: Storage,
    private constants: AppConstantsProvider) {
  }

  async getUserDetails(): Promise<any> {
    if (!this.headersIsSet)await this.setHeaders(); this.headersIsSet=true;
     console.log("Headers here ",this.headers);
    return new Promise((resolve, reject) => {
      this.http.get(this.constants.BASEURL + '/user',{headers:this.headers}).toPromise()
        .then(resp => {
          resolve(resp);
        })
        .catch(error => {
          reject(error);
        })
    })
  }

  async setHeaders(){
    this.headers.set("Content-Type", "application/json;charset=UTF-8");
    let token = await this.storage.get("token");
    this.headers = this.headers.append('Authorization', "JWT " + token);
  }
}
