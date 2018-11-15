import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserActionsProvider } from '../../providers/user-actions/user-actions';
import { CategoryGroupsPage } from '../category-groups/category-groups';
import { ExpenseGroupsPage } from '../expense-groups/expense-groups';

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
    private alertCtrl:AlertController) {

  }
  ionViewDidLoad(){
      this.loader.present()
      this.getUserDetails()
  }

  getUserDetails(){
    this.userActions.getUserDetails()
    .then(resp=>{
        console.log(resp);
        this.storage.set("user_details",resp);
        this.userDetails=resp;
        this.loader.dismiss();
    }).catch(error=>{
      this.loader.dismiss()
      const alert = this.alertCtrl.create({
        title: "Error",
        subTitle: error.error.error,
        buttons: ['OK']
      })
      alert.present();
    })
  }

  openPage(char:string){
    switch(char){
      case 'c': this.navCtrl.push(CategoryGroupsPage); break;
      case 'e': this.navCtrl.push(ExpenseGroupsPage); break;
    }
  }
}
