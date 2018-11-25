import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AppConstantsProvider } from '../../providers/app-constants/app-constants';
import { ExpenseStatisticsPage } from '../expense-statistics/expense-statistics';
import { UserActionsProvider } from '../../providers/user-actions/user-actions';

/**
 * Generated class for the MyProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl:AlertController, private constants:AppConstantsProvider,
    private userActions:UserActionsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyProfilePage');
  }

  async deleteAccount(){
    try{
      let resp = await this.userActions.deleteAccount();
    }
    catch(error){

    }
  }

  goToStats(){
    this.navCtrl.push(ExpenseStatisticsPage);
  }

  presentDeleteAlert(){
    const alert = this.alertCtrl.create({
      title: "Delete Account?",
      subTitle: "Are you sure you want to delete your account?",
      buttons: [{
        text: "NO"
      },
      {
        text: "YES",
        handler: () => {
          this.deleteAccount()
        }
      }]
    });
    alert.present();
  }

  presentUpdatePasswordAlert(){
    const prompt = this.alertCtrl.create({
      title: 'Update Password',
      inputs: [
        {
          name: "password",
          placeholder: 'old password',
          type: "password"
        },
        {
          name: 'newPassword',
          placeholder: 'new password',
          type: "password"
        },
        {
          name: 'newPasswordConfirm',
          placeholder: 'confirm new password',
          type: "password"
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Update',
          handler: data => {

            var format = /[ ]/;

            let bool: boolean = data.password.match(format) ? true : false;
            bool = bool || data.newPassword.match(format) ? true : false;

            if (bool) {
              let message:string = "Invalid field, whitespaces not allowed";
              this.constants.presentAlert("Error", message);
              return false;
            }

            bool = data.password.trim()==""?true:false;
            bool = bool || data.newPassword.trim()==""?true:false;

            if (bool) {
              let message:string = "Invalid field";
              this.constants.presentAlert("Error", message);
              return false;
            }

            bool = data.newPassword.length<6?true:false;
            if (bool){
              let message:string = "Password is too short. Minimum length is 6"
              this.constants.presentAlert("Error",message);
              return false;
            }

            if(data.newPassword != data.newPasswordConfirm){
              let message:string = "Password mismatch";
              this.constants.presentAlert("Error", message);
              return false;
            }

            try {
              this.updatePassword(data.password,data.newPassword);
            } 
            catch (error) {
              console.log("Error when calling update password is ", error);
            }
          }
        }
      ]
    });

    prompt.present();
  }

  async updatePassword(oldPassword:string,newPassword:string){
    try{
      let resp = await this.userActions.updatePassword(oldPassword,newPassword);
      this.constants.presentAlert("Success",resp.message)
    }
    catch(error){
      this.constants.presentAlert("Error",error.error.message);
    }
  }
}
