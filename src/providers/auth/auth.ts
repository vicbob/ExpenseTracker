import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstantsProvider } from '../app-constants/app-constants';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  headers:HttpHeaders = new HttpHeaders();
  constructor(public http: HttpClient,private constants:AppConstantsProvider) {
    console.log('Hello AuthProvider Provider');
    this.headers.set("Content-Type","application/json;charset=UTF-8");
  }

  resetPassword(email:string):Promise<any>{
    return new Promise((resolve,reject)=>{
      // to do
      resolve({message:"A password reset email has been sent to your email, please check it"})
    });
  }

  async login(email:string, password:string):Promise<any>{
    let body = {
      "username":email,
      "password":password
    }
      return await this.http.post(this.constants.BASEURL+'/login',body,{headers:this.headers}).toPromise()
  }

  register(username:string,email:string, password:string):Promise<any>{
    return new Promise((resolve,reject)=>{
      let body = {
        "username":username,
        "email": email,
        "password":password
      }
      this.http.post(this.constants.BASEURL+'/register',body,{headers:this.headers}).toPromise()
      .then(resp=>{
        resolve(resp);
      }).catch(error=>{
        reject(error);
      })
    })
  }

}
