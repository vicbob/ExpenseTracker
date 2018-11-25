import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AppConstantsProvider } from '../app-constants/app-constants';
import { LoadingController } from 'ionic-angular';
import * as moment from "moment";
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
    private constants: AppConstantsProvider,
    private loadingCtrl: LoadingController) {
  }

  addExpense(expense): Promise<any> {
    this.setHeadersIfNotSet();
    let body = {
      "name": expense.name, "price": expense.price,
      "category": expense.category
    }
    console.log(body);
    return new Promise((resolve, reject) => {
      this.http.post(this.constants.BASEURL + '/user/expense', body
        , { headers: this.headers }).toPromise()
        .then(resp => {
          resolve(resp);
        })
        .catch(error => {
          reject(error);
        })
    })
  }

  deleteAccount(): Promise<any> {
    return
  }

  deleteExpense(expense): Promise<any> {
    this.setHeadersIfNotSet();
    return new Promise((resolve, reject) => {
      let d = moment(expense.date);
      let body = { "name": expense.name, "date": d.format("YYYY-MM-DD") }
      let options = {
        headers: this.headers,
        body: body
      }
      this.http.delete(this.constants.BASEURL + '/user/expense', options).toPromise()
        .then(resp => {
          resolve(resp);
        })
        .catch(error => {
          reject(error);
        })
    })
  }

  editExpense(expense, price: number, category: string): Promise<any> {
    this.setHeadersIfNotSet();
    return new Promise((resolve, reject) => {
      let d = moment(expense.date);
      let body = {
        "name": expense.name, "date": d.format("YYYY-MM-DD"),
        "price": price, "category": category
      };

      this.http.put(this.constants.BASEURL + '/user/expense', body, { headers: this.headers }).toPromise()
        .then(resp => {
          resolve(resp);
        })
        .catch(error => {
          reject(error);
        })
    })
  }

  async getDetails(loaderMessage: string) {
    const loader = this.loadingCtrl.create({
      content: loaderMessage
    });
    loader.present();
    try {
      let resp = await this.getUserDetails();
      this.constants.username.next(resp.username);
      this.constants.email.next(resp.email);
      this.storage.set("user_details", resp);
      loader.dismiss();
    }
    catch (error) {
      loader.dismiss();
      this.constants.presentAlert("Error", error.error.error);
    }
  }

  /* Will return user details object with chronologically 
  sorted expenses.
  */
  async getUserDetails(): Promise<any> {
    await this.setHeadersIfNotSet();
    return new Promise(async (resolve, reject) => {
      try {
        let resp = await this.http.get(this.constants.BASEURL + '/user', { headers: this.headers }).toPromise()
        resp = this.constants.arrangeUserDetails(resp);
        resolve(resp);
      }
      catch (error) {
        reject(error);
      }
    })
  }

  logout(): Promise<any> {
    return new Promise(async resolve => {
      await this.storage.clear();
      this.headers = this.headers.delete('Authorization');
      this.headersIsSet = false;
      resolve(true);
    })
  }

  async setHeadersIfNotSet() {
    if (!this.headersIsSet) await this.setHeaders(); this.headersIsSet = true;
  }

  async setHeaders() {
    this.headers.set("Content-Type", "application/json;charset=UTF-8");
    let token = await this.storage.get("token");
    this.headers = this.headers.append('Authorization', "JWT " + token);
  }

  async updatePassword(oldPassword: string, newPassword: string): Promise<any> {
    try {
      await this.setHeadersIfNotSet();
      let body = {
        "old_password": oldPassword,
        "new_password": newPassword
      }
      return (await this.http.put(this.constants.BASEURL+'/user/password-change',
      body,{headers:this.headers}).toPromise())
    }
    catch (error) {
      console.log("Error in userActions update password is ", error)
    }
  }
}
