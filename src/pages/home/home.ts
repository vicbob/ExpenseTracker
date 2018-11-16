import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserActionsProvider } from '../../providers/user-actions/user-actions';
import { CategoryGroupsPage } from '../category-groups/category-groups';
import { ExpenseGroupsPage } from '../expense-groups/expense-groups';
import { AppConstantsProvider } from '../../providers/app-constants/app-constants';

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
    private alertCtrl:AlertController, private constants:AppConstantsProvider) {

  }
  ionViewDidLoad(){
      this.loader.present()
      this.getUserDetails()
  }

  arrangeUserDetails(){
    let expenses = this.userDetails.expenses
    expenses.forEach(expense => {
      expense.date = new Date(expense.date);
    });
    this.constants.quickSortExpenses(expenses,0,expenses.length-1);
    expenses.reverse();
    this.userDetails.expenses = expenses;
  }


  getUserDetails(){
    this.userActions.getUserDetails()
    .then(resp=>{
        console.log(resp);
        this.userDetails=resp;
        this.arrangeUserDetails();
        this.storage.set("user_details",this.userDetails);
        console.log("Sorted stuff is ",this.userDetails)
        this.loader.dismiss();
    }).catch(error=>{
      this.loader.dismiss()
      console.log("Error is ",error)
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
