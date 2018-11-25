import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserActionsProvider } from '../../providers/user-actions/user-actions';
import { CategoryGroupsPage } from '../category-groups/category-groups';
import { ExpenseGroupsPage } from '../expense-groups/expense-groups';
import { AppConstantsProvider } from '../../providers/app-constants/app-constants';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
   loader = this.loadingCtrl.create({
    content: "Fetching details...."
  })
  userDetails:any={username:"username"};

  constructor(public navCtrl: NavController,private storage:Storage,
    private userActions:UserActionsProvider,private loadingCtrl:LoadingController,
    private alertCtrl:AlertController, private constants:AppConstantsProvider,
    private menu:MenuController) {

  }
  async ionViewDidLoad(){
    try{
      await this.userActions.getDetails("Fetching details....");
      this.loader.present();
      this.menu.enable(true);
      this.userDetails = await this.storage.get('user_details');
      this.loader.dismiss();
    }
    catch(error){
      this.loader.dismiss();
      this.constants.presentToast("An error occured, Please login again",this.logout());
    }

  }

  async logout(){
    this.loader.present();
    await this.userActions.logout();
    await this.navCtrl.popToRoot();
    await this.navCtrl.setRoot(LoginPage);
    this.loader.dismiss();
  }

  openPage(char:string){
    switch(char){
      case 'c': this.navCtrl.push(CategoryGroupsPage); break;
      case 'e': this.navCtrl.push(ExpenseGroupsPage); break;
    }
  }
}
