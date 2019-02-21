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
  });

  constructor(public navCtrl: NavController,private storage:Storage,
    private userActions:UserActionsProvider,private loadingCtrl:LoadingController,
    private alertCtrl:AlertController, private constants:AppConstantsProvider,
    private menu:MenuController) {

  }
  async ionViewDidLoad(){
    await this.loader.present();
    try{
      await this.userActions.getDetails("Fetching details....");
    }
    catch(error){
      this.loader.dismiss();
      console.log("Error is ",error);
      this.constants.presentToast("An error occured, Please login again",this.logout());
    }
      this.menu.enable(true);
      this.loader.dismiss();
   
  }

  //Forced logout when an error occurs fetching details
  async logout(){
    await this.loader.present();
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
