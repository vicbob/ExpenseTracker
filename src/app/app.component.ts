import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { ExpenseGroupsPage } from '../pages/expense-groups/expense-groups';
import { CategoryGroupsPage } from '../pages/category-groups/category-groups';

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
    private storage: Storage) {
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

  logout() {

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

  updatePassword() {

  }
}
