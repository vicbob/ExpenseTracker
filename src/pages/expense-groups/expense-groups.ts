import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ExpensesPage } from '../expenses/expenses';

/**
 * Generated class for the ExpenseGroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-expense-groups',
  templateUrl: 'expense-groups.html',
})
export class ExpenseGroupsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseGroupsPage');
  }

  openPage(num:number,title:string){
      this.navCtrl.push(ExpensesPage,{'case':num,'title':title});
    }
  }

