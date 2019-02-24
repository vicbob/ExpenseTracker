import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ExportsProvider } from '../../providers/exports/exports';
import { AppConstantsProvider } from '../../providers/app-constants/app-constants';

/**
 * Generated class for the ReportGeneratorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-report-generator',
  templateUrl: 'report-generator.html',
})
export class ReportGeneratorPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage:Storage,private exports:ExportsProvider, private constants:AppConstantsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportGeneratorPage');
  }

  async generateReport(char:string){
    let user_details = await this.storage.get('user_details');
    let expenses = user_details.expenses

    switch (char) {
      case '0':this.exports.exportPdf(expenses.filter(expense=>{
        return this.constants.thisMonth(expense)
      }))
        break;

      case '1':this.exports.exportPdf(expenses.filter(expense=>{
        return this.constants.lastMonth(expense)
      }))
        break;
      
      case '2':
        break;
    
      default:
        break;
    }
  }

}
