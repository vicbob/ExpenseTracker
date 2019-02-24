import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, DateTime, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from "moment"
import { TitleCasePipe } from '@angular/common';
import { UserActionsProvider } from '../../providers/user-actions/user-actions';
import { AppConstantsProvider } from '../../providers/app-constants/app-constants';
import { ExportsProvider } from '../../providers/exports/exports';

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
  filteredExpense: any[] = [];
  dayGroups = new Set();
  groupKeys: string[] = [];
  arrangedFilteredExpense = new Map();
  monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  naira = String.fromCharCode(8358);
  loader = this.loadingCtrl.create({
    content: "Please wait...."
  });

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController,
    private userActions: UserActionsProvider, private constants: AppConstantsProvider,
    private exportsProv:ExportsProvider) {
  }


  async ionViewDidLoad() {
    console.log("Symbol is ", this.naira);
    console.log('ionViewDidLoad ExpensesPage');
    this.loader.present();
    this.title = this.navParams.get('title');
    let data = await this.storage.get('user_details');
    this.expenses = data.expenses;
    this.expenseFilter(this.navParams.get('case'));
    this.getClassifications();
    this.classify();
    this.loader.dismiss();
  }


  //callback to be called by toast after an action
  async afterActionCallback() {
    await this.userActions.getDetails("Refreshing. Please wait....");
    this.navCtrl.pop();
    console.log("Nav params data is ", this.navParams.data);
    this.navCtrl.push(ExpensesPage, this.navParams.data);
  }


  // Prepares the data for display in the form of a dictionary
  classify() {
    this.dayGroups.forEach(element => {
      let d = new Date(element);
      let key: string = moment(element, "YYYY-MM-DD").format("DD MMM, YYYY");

      if ((d.getDate() === new Date().getDate()) &&
        d.getMonth() === new Date().getMonth()) { key = "Today" }
      else if (((d.getDate() + 1) % (this.monthDays[d.getMonth()]) === new Date().getDate())
        && d.getMonth() === new Date().getMonth()) {
        key = "Yesterday";
      }

      this.groupKeys.push(key);
      this.arrangedFilteredExpense.set(key,
        this.filteredExpense.filter(expense => expense.date.toISOString() === element))
    });
    console.log(this.arrangedFilteredExpense);
    console.log(this.arrangedFilteredExpense.keys.length);
  }

  async deleteExpense(expense: any) {
    let newLoader = this.loadingCtrl.create({
      content: "Please wait...."
    });
    newLoader.present();

    try {
      let resp: any = await this.userActions.deleteExpense(expense);
      newLoader.dismiss();
      this.constants.presentToast(resp.message,
        this.afterActionCallback());
    } catch (error) {
      newLoader.dismiss();
      console.log("The deletion error is ", error)
      this.constants.presentAlert("Error", error.message);
    }
  }

  async editExpense(expense: any, price: number, category: string) {
    let newLoader = this.loadingCtrl.create({
      content: "Please wait...."
    });

    newLoader.present()
    try {
      let resp: any = await this.userActions.editExpense(expense, price, category);
      await newLoader.dismiss();

      await this.constants.presentToast(resp.message,
        await this.afterActionCallback());
    } catch (error) {
      await newLoader.dismiss();
      console.log("The edit error is ", error)
      await this.constants.presentAlert("Error", error.message);
    }
  }


  expenseFilter(num: number) {
    switch (num) {
      case 0: this.filteredExpense = this.expenses.filter(expense => {
        return this.constants.thisMonth(expense)
      });
        console.log(this.filteredExpense)
        break;

      case 1: this.filteredExpense = this.expenses.filter(expense => {
        return this.constants.lastMonth(expense)
      });
        console.log(this.filteredExpense)
        break;

      case 2:
        this.filteredExpense = this.expenses.filter(expense => {
          return this.constants.lastTwoMonths(expense)
        });
        console.log(this.filteredExpense)
        break;

      case 3: this.filteredExpense = this.expenses.filter(expense => {
        let d = new Date();
        let monthDifference = d.getMonth() - expense.date.getMonth()
        let yearDifference = d.getFullYear() - expense.date.getFullYear();

        //This month logic
        if (!this.constants.thisMonth(expense) && 
        !this.constants.lastMonth(expense) &&
        !this.constants.lastTwoMonths(expense)) {
          return expense
        }
      });
        console.log(this.filteredExpense)
        break;

      case 4: this.filteredExpense = this.expenses.filter(
        expense => expense.category === this.navParams.get('title')
      );
        console.log("Category is ", this.navParams.get('title'));
        break;


      default: console.log("Something went impossibly wrong")
        break;
    }
  }


  export() {
      let expenses = this.filteredExpense.slice()
      expenses.reverse()
      expenses.forEach(expense=>{
        expense.date = moment(expense.date).format("YYYY-MM-DD")
      })
      this.exportsProv.exportXlsx(expenses)
  }

  getClassifications() {
    this.filteredExpense.forEach(expense => {
      this.dayGroups.add(expense.date.toISOString());
    });
    console.log("Day groups is ", this.dayGroups)
  }


  options(expense: any) {
    console.log("I was clicked on ", expense);
    let cssClass: string = "disabled";
    let d = new Date();
    if (expense.date.getMonth() === d.getMonth() &&
      expense.date.getFullYear() === d.getFullYear()) {
      cssClass = "none"
    }
    this.presentActionSheet(expense, cssClass);
  }


  presentActionSheet(expense: any, cssClass: string) {
    const actionSheet = this.actionSheetCtrl.create({
      title: new TitleCasePipe().transform(expense.name),
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          cssClass: cssClass,
          handler: () => {
            this.presentDeleteAlert(expense);
          }
        }, {
          text: 'Edit',
          role: 'destructive',
          icon: 'create',
          cssClass: cssClass,
          handler: () => {
            this.presentEditAlert(expense);
          }
        }, {
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

  presentDeleteAlert(expense) {
    const alert = this.alertCtrl.create({
      title: "Delete?",
      subTitle: "Are you sure you want to delete this expense?",
      buttons: [{
        text: "NO"
      },
      {
        text: "YES",
        handler: () => {
          this.deleteExpense(expense)
        }
      }]
    });
    alert.present();
  }

  presentEditAlert(expense) {
    const prompt = this.alertCtrl.create({
      title: 'Edit ' + expense.name,
      message: "Enter the Price and Category",
      inputs: [
        {
          name: "price",
          placeholder: expense.price,
          type: "number"
        },
        {
          name: 'category',
          placeholder: expense.category || "Uncategorized",
          type: "text"
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
          text: 'Save',
          handler: data => {

            var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
            var format2 = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;


            let bool: boolean = data.category.match(format2) ? true : false;
            bool = bool || data.category.trim() == "" ? true : false;
            bool = bool || data.category.trim().toLowerCase() == "uncategorized" ? true : false;

            let bool2: boolean = data.price < 5 ? true : false;
            bool2 = bool2 || data.price.trim() == "" ? true : false;

            if (bool || bool2) {
              let message: string = "Invalid field";

              if (data.category.trim().toLowerCase() == "uncategorized") {
                message = message.concat(". Category cannot be uncategorized");
              }

              this.constants.presentAlert("Error", message);
              return false;
            }

            try {
              this.editExpense(expense, data.price, data.category.trim());
            }
            catch (error) {
              console.log("Error when calling edit function is ", error);
            }
          }
        }
      ]
    });

    prompt.present();

  }

}
