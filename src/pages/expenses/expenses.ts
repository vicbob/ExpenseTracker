import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, DateTime } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from "moment"

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
      this.dayGroups.add(expense.date.toISOString());
    });
    console.log("Day groups is ",this.dayGroups)
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

      default: console.log("Something went impossibly wrong")
        break;
    }
  }
}
