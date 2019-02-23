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
    private appConstants:AppConstantsProvider) {
    console.log('Hello StatisticsProvider Provider');
  }

  async generateStats(expenses: any = ""): Promise<any> {

    if (expenses == "") {
      let userDetails = await this.storage.get("user_details")
      expenses = userDetails.expenses
      console.log(expenses);
    }
    
    let {hsc,lsc} = await this.calculateLSCAndHSC(expenses)
    
    return {hsc:hsc,lsc:lsc};
  }

  //completed
  async calculateLSCAndHSC(expenses: any[]) {
    let categories = await this.categorize(expenses)
    let sumOfCategoryPrices:number[] = []
    let i = -1
    await categories.forEach(async category=>{
      i++
      sumOfCategoryPrices.push(0) //initialize array
      await expenses.forEach((expense)=>{
          if(expense.category==category){
            sumOfCategoryPrices[i] += expense.price
          }
      })
    })
    
    let hsc:any={},lsc:any = {};
    let arr = sumOfCategoryPrices.slice()//copy values
    arr.sort(function(a, b){return a-b});
    hsc.price = arr[arr.length-1];
    hsc.category = categories[sumOfCategoryPrices.indexOf(hsc.price)]
    
    lsc.price = arr[0]
    lsc.category = categories[sumOfCategoryPrices.indexOf(lsc.price)]

    console.log(lsc,hsc);
    return {hsc:hsc,lsc:lsc}
    
  }

  async categorize(expenses:Array<any>) {
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

}
