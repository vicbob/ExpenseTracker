import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AppConstantsProvider } from '../app-constants/app-constants';

/*
  Generated class for the StatisticsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StatisticsProvider {

  constructor(public http: HttpClient, private storage: Storage,
    private appConstants: AppConstantsProvider) {
    console.log('Hello StatisticsProvider Provider');
  }

  async generateStats(expenses: any = ""): Promise<any> {

    if (expenses == "") {
      let userDetails = await this.storage.get("user_details")
      expenses = userDetails.expenses
      console.log(expenses);
    }

    let { hsc, lsc } = await this.calculateLSCAndHSC(expenses)
    let hpe = await this.calculateHpe(expenses)
    let { lsd, hsd } = await this.calculateHsdandLsd(expenses)

    return { hsc: hsc, lsc: lsc, hpe: hpe, lsd: lsd, hsd: hsd };
  }

  //completed
  async calculateLSCAndHSC(expenses: any[]) {
    let categories = await this.categorize(expenses)
    let sumOfCategoryPrices: number[] = []
    let i = -1
    await categories.forEach(async category => {
      i++
      sumOfCategoryPrices.push(0) //initialize array
      await expenses.forEach((expense) => {
        if (expense.category == category) {
          sumOfCategoryPrices[i] += expense.price
        }
      })
    })

    let hsc: any = {}, lsc: any = {};
    let arr = sumOfCategoryPrices.slice()//copy values
    arr.sort(function (a, b) { return a - b });
    hsc.price = arr[arr.length - 1];
    hsc.category = categories[sumOfCategoryPrices.indexOf(hsc.price)]

    lsc.price = arr[0]
    lsc.category = categories[sumOfCategoryPrices.indexOf(lsc.price)]

    return { hsc: hsc, lsc: lsc }
  }


  async calculateHpe(expenses: any[]) {
    let arr = expenses.slice()
    arr.sort(function (a, b) { return a.price - b.price })
    return arr[arr.length - 1]
  }


  async calculateHsdandLsd(expenses: any[]) {
    expenses.forEach(expense=>{
      expense.date = new Date(expense.date)
    })
    let days = await this.dayClassify(expenses)

    let sumOfDayPrices: number[] = []
    let i = -1
    await days.forEach(async day => {
      i++
      sumOfDayPrices.push(0) //initialize array
      await expenses.forEach((expense) => {
        let date = expense.date
        if (day.getDate() == date.getDate() && day.getMonth() == date.getMonth() &&
        day.getFullYear() == date.getFullYear()) {
          sumOfDayPrices[i] += expense.price
        }
      })
    })

    let hsd: any = {}, lsd: any = {};
    let arr = sumOfDayPrices.slice()//copy values
    arr.sort(function (a, b) { return a - b })

    hsd.amount = arr[arr.length - 1]
    hsd.date = days[sumOfDayPrices.indexOf(hsd.amount)]

    lsd.amount = arr[0]
    lsd.date = days[sumOfDayPrices.indexOf(lsd.amount)]

    return ({ lsd: lsd, hsd: hsd })
  }


  async categorize(expenses: Array<any>) {
    let c = [];
    await expenses.forEach(expense => {
      if (expense.category === null) c.push(null);
      else c.push(expense.category.toLowerCase());
    });
    c.sort();
    let categoriesSet = new Set(c);
    let categories = Array.from(categoriesSet);
    return categories;
  }

  //returns all the unique dates in the expenses array
  async dayClassify(expenses: any[]) {
    let d = [];

    for (let i = 0; i < expenses.length; i++) {
      let bool = await this.Present(d, expenses[i].date);
      console.log("value of bool is", bool);

      if (!bool) {
        console.log("inside if");
        d.push(expenses[i].date)
        console.log("new d is", d)
      }
    }
    return d;
  }

  async Present(days: Date[], date: Date): Promise<any> {
    console.log("here 1");

    return new Promise(async resolve => {
      await days.forEach(async day => {
        console.log("here 2");

        if (day.getDate() == date.getDate() && day.getMonth() == date.getMonth() &&
          day.getFullYear() == date.getFullYear()) {
          console.log("date equal");
          resolve(true);
        }
      });
      console.log("not equal")
      resolve(false)
    })

  }
}
