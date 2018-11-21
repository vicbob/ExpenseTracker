import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { ExpenseGroupsPage } from '../pages/expense-groups/expense-groups';
import { CategoryGroupsPage } from '../pages/category-groups/category-groups';
import { AppConstantsProvider } from '../providers/app-constants/app-constants';
import { UserActionsProvider } from '../providers/user-actions/user-actions';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{ title: string, component: any }>;

  public username: string = "username";
  public email: string = "email@mail.com"

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private storage: Storage, private alertCtrl: AlertController,
    private loadingCtrl: LoadingController, private userActions:UserActionsProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: "Expenses", component: ExpenseGroupsPage },
      { title: 'Categories', component: CategoryGroupsPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(async () => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      await this.getUser();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  async logout() {
    const loader = this.loadingCtrl.create({
      content: "Logging out...."
    })
    loader.present();
    await this.userActions.logout();
    await this.nav.popToRoot();
    await this.nav.setRoot(LoginPage);
    loader.dismiss();
  }

  async getUser(): Promise<any> {
    try {
      let data = await this.storage.get("user_details");
      this.username = data.username;
      this.email = data.email;
    } catch (error) {
      console.log(error);
    }
  }

  presentLogoutConfirmationAlert() {
    const alert = this.alertCtrl.create({
      title: "Logout?",
      subTitle: "Are you sure you want to logout?",
      buttons: [
        {
          text: "NO"
        },
        {
          text: "YES",
          handler: () => {
            this.logout();
          }
        }
      ]
    });
    alert.present();
  }

  updatePassword() {

  }
}
