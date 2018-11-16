import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, DateTime } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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
  filteredExpense: any;
  dayGroups = new Set();
  arrangedFilteredExpense= new Map();
  monthDays = [31,28,31,30,31,30,31,31,30,31,30,31]

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private loadingCtrl: LoadingController) {
  }


  async ionViewDidLoad() {
    console.log('ionViewDidLoad ExpensesPage');
    const loader = this.loadingCtrl.create({
      content: "Please wait. Loading...."
    })
    loader.present();
    this.title = this.navParams.get('title')+ "'s expenses";
    let data = await this.storage.get('user_details');
    this.expenses = data.expenses;
    this.expenseFilter(this.navParams.get('case'));
    this.getClassifications();
    this.classify();
    loader.dismiss();
  }

  getClassifications(){
    this.filteredExpense.forEach(expense => {
      this.dayGroups.add(expense.date);
    });
  }

  classify(){
    this.dayGroups.forEach(element => {
      let d = new Date(element);
      let key:string = element;
      if (d.getDay()===new Date().getDay()){key = "today"}
      else if((d.getDay()+1)%(this.monthDays[d.getMonth()])===new Date().getDay()){
        key = "yesterday";
      }
      this.arrangedFilteredExpense.set(key,
        this.filteredExpense.filter(expense=> expense.day==element))
    });
    console.log(this.arrangedFilteredExpense);
  }


  expenseFilter(num: number) {
    switch (num) {
      case 0: this.filteredExpense = this.expenses.filter(expense => {
        let d = new Date();
        let expense_date = new Date(expense.date);

        if (expense_date.getMonth() === d.getMonth() && expense_date.getFullYear()
          === d.getFullYear()) {
          return expense
        }
      });
        console.log(this.filteredExpense)
        break;

      case 1: this.filteredExpense = this.expenses.filter(expense => {
        let d = new Date();
        let expense_date = new Date(expense.date);
        let yearDifference = d.getFullYear() - expense_date.getFullYear();

        if ((expense_date.getMonth() + 1) % 12 === d.getMonth()
          && yearDifference < 2) {
          return expense
        }
      });
        console.log(this.filteredExpense)
        break;

      case 2:
        this.filteredExpense = this.expenses.filter(expense => {
          let d = new Date();
          let expense_date = new Date(expense.date);
          let yearDifference = d.getFullYear() - expense_date.getFullYear();

          if ((expense_date.getMonth() + 2) % 12 === d.getMonth()
            && yearDifference < 2) {
            return expense
          }
        });
        console.log(this.filteredExpense)
        break;

      case 3: this.filteredExpense = this.expenses.filter(expense => {
        let d = new Date();
        let expense_date = new Date(expense.date);
        let monthDifference = d.getMonth() - expense_date.getMonth()
        let yearDifference = d.getFullYear() - expense_date.getFullYear();

        //This month logic
        if (!((expense_date.getMonth() === d.getMonth() && expense_date.getFullYear()
          === d.getFullYear())
          || ((expense_date.getMonth() + 1) % 12 === d.getMonth()
            && yearDifference < 2)
          || ((expense_date.getMonth() + 2) % 12 === d.getMonth()
            && yearDifference < 2))) {
          return expense
        }
      });
        console.log(this.filteredExpense)
        break;

      default: console.log("Something went impossibly wrong")
        break;
    }
  }
}
