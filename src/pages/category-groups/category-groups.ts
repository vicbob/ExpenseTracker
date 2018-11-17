import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ExpensesPage } from '../expenses/expenses';

/**
 * Generated class for the CategoryGroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category-groups',
  templateUrl: 'category-groups.html',
})
export class CategoryGroupsPage {
  categories = new Set();
  expenses:any[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage:Storage) {
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryGroupsPage');
    let userDetails = await this.storage.get('user_details');
    console.log(this.storage.get('user_details'));
    this.expenses = userDetails.expenses;
    console.log(this.expenses);
    this.categorize();
  }

  categorize(){
    this.expenses.forEach(expense => {
      if(expense.category === null) this.categories.add(null); 
       else this.categories.add(expense.category.toLowerCase());
    });
    console.log(this.categories);
  }

  goToExpenses(category:string){
    this.navCtrl.push(ExpensesPage,{'case':4,'title':category})
  }

}
