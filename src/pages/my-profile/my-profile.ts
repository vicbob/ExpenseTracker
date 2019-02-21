import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AppConstantsProvider } from '../../providers/app-constants/app-constants';
import { ExpenseStatisticsPage } from '../expense-statistics/expense-statistics';
import { UserActionsProvider } from '../../providers/user-actions/user-actions';
import { LoginPage } from '../login/login';
import { ReportGeneratorPage } from '../report-generator/report-generator';

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
  loader = this.loadingCtrl.create({
    content: "Please wait...."
  });

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController, private constants: AppConstantsProvider,
    private userActions: UserActionsProvider, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyProfilePage');
  }

  async afterDeleteCallback() {
    const loader = this.loadingCtrl.create({
      content: "Please wait...."
    })
    await loader.present();
    await this.userActions.logout();
    await this.navCtrl.popToRoot();
    await this.navCtrl.setRoot(LoginPage);
    loader.dismiss();
  }

  async deleteAccount() {
    await this.loader.present();
    try {
      await this.userActions.deleteAccount();
      await this.loader.dismiss();
      await this.constants.presentToast("Your account was successfully deleted", this.afterDeleteCallback());
    }
    catch (error) {
      this.loader.dismiss();
      this.constants.presentAlert("Error", error.error.message);
    }
  }

  openPage(char: string) {
    switch (char) {
      case 's': this.navCtrl.push(ExpenseStatisticsPage); break;
      case 'g': this.navCtrl.push(ReportGeneratorPage); break;
    }
  }

  presentDeleteAlert() {
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

  presentUpdatePasswordAlert() {
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
              let message: string = "Invalid field, whitespaces not allowed";
              this.constants.presentAlert("Error", message);
              return false;
            }

            bool = data.password.trim() == "" ? true : false;
            bool = bool || data.newPassword.trim() == "" ? true : false;

            if (bool) {
              let message: string = "Invalid field";
              this.constants.presentAlert("Error", message);
              return false;
            }

            bool = data.newPassword.length < 6 ? true : false;
            if (bool) {
              let message: string = "Password is too short. Minimum length is 6"
              this.constants.presentAlert("Error", message);
              return false;
            }

            if (data.newPassword != data.newPasswordConfirm) {
              let message: string = "Password mismatch";
              this.constants.presentAlert("Error", message);
              return false;
            }

            try {
              this.updatePassword(data.password, data.newPassword);
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

  async updatePassword(oldPassword: string, newPassword: string) {
    this.loader.present();
    try {
      let resp = await this.userActions.updatePassword(oldPassword, newPassword);
      this.loader.dismiss();
      this.constants.presentAlert("Success", resp.message)
    }
    catch (error) {
      this.loader.dismiss();
      this.constants.presentAlert("Error", error.error.message);
    }
  }
}
