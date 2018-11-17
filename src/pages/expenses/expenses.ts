import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, DateTime, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from "moment"
import { TitleCasePipe } from '@angular/common';
import { UserActionsProvider } from '../../providers/user-actions/user-actions';
import { AppConstantsProvider } from '../../providers/app-constants/app-constants';

/**
 * Generated class for the ExpensesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-expenses',
  templateUrl: 'expenses.html',
})
export class ExpensesPage {
  title: string;
  expenses: any[]
  filteredExpense: any = [];
  dayGroups = new Set();
  groupKeys:string[] = [];
  arrangedFilteredExpense= new Map();
  monthDays = [31,28,31,30,31,30,31,31,30,31,30,31]
  naira = String.fromCharCode(8358);

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private loadingCtrl: LoadingController,
    private actionSheetCtrl:ActionSheetController, private alertCtrl:AlertController,
    private userActions:UserActionsProvider, private constants:AppConstantsProvider) {
  }


  async ionViewDidLoad() {
    console.log("Symbol is ",this.naira);
    console.log('ionViewDidLoad ExpensesPage');
    const loader = this.loadingCtrl.create({
      content: "Please wait. Loading...."
    })
    loader.present();
    this.title = this.navParams.get('title');
    let data = await this.storage.get('user_details');
    this.expenses = data.expenses;
    this.expenseFilter(this.navParams.get('case'));
    this.getClassifications();
    this.classify();
    loader.dismiss();
  }

  async afterDeleteCallback(){
    await this.userActions.getDetails("Refreshing. Please wait....");
    this.navCtrl.pop();
    console.log("Nav params data is ", this.navParams.data);
    this.navCtrl.push(ExpensesPage,this.navParams.data);
  }

  classify(){
    this.dayGroups.forEach(element => {
      let d = new Date(element);
      let key:string = moment(element,"YYYY-MM-DD").format("DD MMM YYYY");

      if ((d.getDay()===new Date().getDay())&&
      d.getMonth()===new Date().getMonth()){key = "Today"}
      else if(((d.getDay()+1)%(this.monthDays[d.getMonth()])===new Date().getDay())
      && d.getMonth() === new Date().getMonth()){
        key = "Yesterday";
      }
      this.groupKeys.push(key);
      this.arrangedFilteredExpense.set(key,
        this.filteredExpense.filter(expense=> expense.date.toISOString()===element))
    });
    console.log(this.arrangedFilteredExpense);
    console.log(this.arrangedFilteredExpense.keys.length);
  }

   async deleteExpense(expense:any){
     try{
    let resp:any = await this.userActions.deleteExpense(expense);
    this.constants.presentToast(resp.message,
      this.afterDeleteCallback());
     }catch(error){
       console.log("The deletion error is ",error)
      this.constants.presentAlert("Error",error.message);
     }
  }

  expenseFilter(num: number) {
    switch (num) {
      case 0: this.filteredExpense = this.expenses.filter(expense => {
        let d = new Date();

        if (expense.date.getMonth() === d.getMonth() && expense.date.getFullYear()
          === d.getFullYear()) {
          return expense
        }
      });
        console.log(this.filteredExpense)
        break;

      case 1: this.filteredExpense = this.expenses.filter(expense => {
        let d = new Date();
        let yearDifference = d.getFullYear() - expense.date.getFullYear();

        if ((expense.date.getMonth() + 1) % 12 === d.getMonth()
          && yearDifference < 2) {
          return expense
        }
      });
        console.log(this.filteredExpense)
        break;

      case 2:
        this.filteredExpense = this.expenses.filter(expense => {
          let d = new Date();
          let yearDifference = d.getFullYear() - expense.date.getFullYear();

          if ((expense.date.getMonth() + 2) % 12 === d.getMonth()
            && yearDifference < 2) {
            return expense
          }
        });
        console.log(this.filteredExpense)
        break;

      case 3: this.filteredExpense = this.expenses.filter(expense => {
        let d = new Date();
        let monthDifference = d.getMonth() - expense.date.getMonth()
        let yearDifference = d.getFullYear() - expense.date.getFullYear();

        //This month logic
        if (!((expense.date.getMonth() === d.getMonth() && expense.date.getFullYear()
          === d.getFullYear())
          || ((expense.date.getMonth() + 1) % 12 === d.getMonth()
            && yearDifference < 2)
          || ((expense.date.getMonth() + 2) % 12 === d.getMonth()
            && yearDifference < 2))) {
          return expense
        }
      });
        console.log(this.filteredExpense)
        break;

        case 4: this.filteredExpense = this.expenses.filter(
          expense=>expense.category === this.navParams.get('title')
        );
        console.log("Category is ",this.navParams.get('title'));
        break;


      default: console.log("Something went impossibly wrong")
        break;
    }
  }

  
  getClassifications(){
    this.filteredExpense.forEach(expense => {
      this.dayGroups.add(expense.date.toISOString());
    });
    console.log("Day groups is ",this.dayGroups)
  }

  options(expense:any){
    console.log("I was clicked on ",expense);
    let cssClass:string = "disabled";
    let d = new Date();
    if(expense.date.getMonth()===d.getMonth() && 
    expense.date.getFullYear()=== d.getFullYear()){
      cssClass = "none"
    }
    this.presentActionSheet(expense,cssClass);
  }

  presentActionSheet(expense:any,cssClass:string) {
    const actionSheet = this.actionSheetCtrl.create({
      title: new TitleCasePipe().transform(expense.name),
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon:  'trash',
          cssClass: cssClass,
          handler: () => {
            this.presentDeleteAlert(expense);
          }
        },{
          text: 'Edit',
          role: 'destructive',
          icon: 'create',
          cssClass: cssClass,
          handler: () => {
            console.log('Edit clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  presentDeleteAlert(expense){
    const alert = this.alertCtrl.create({
      title: "Delete?",
      subTitle: "Are you sure you want to delete this expense?",
      buttons: [{
        text: "NO"
      },
      {
        text: "YES",
        handler: ()=>{
          this.deleteExpense(expense)}
      }]
    });
    alert.present();
  }

}
