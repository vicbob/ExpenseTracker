import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { StatisticsProvider } from '../../providers/statistics/statistics';

/**
 * Generated class for the ExpenseStatisticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-expense-statistics',
  templateUrl: 'expense-statistics.html',
})
export class ExpenseStatisticsPage {
  result = {
    hsc: { category: "", price: "" },
    lsc: { category: "", price: "" },
    hpe: { category: "", price: "", date: "", name: "" },
    hsd: { date: "", amount: "" },
    lsd: { date: "", amount: "" }
  }
  naira = String.fromCharCode(8358);

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private statsProvider: StatisticsProvider, private loadingCtrl: LoadingController) {
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseStatisticsPage');
    let loader = this.loadingCtrl.create({
      content: "Calculating details...."
    })
    loader.present()
    this.result = await this.statsProvider.generateStats();
    loader.dismiss()
  }

}
