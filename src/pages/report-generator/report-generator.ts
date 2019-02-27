import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
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
  filteredExpense: any = [];
  months = ["Januuary", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"]

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private exports: ExportsProvider, private constants: AppConstantsProvider,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportGeneratorPage');
  }

  async generateReport(char: string) {
    let user_details = await this.storage.get('user_details');
    let expenses = user_details.expenses
    let d = new Date()
    let title: String = ""

    switch (char) {
      case '0': this.filteredExpense = expenses.filter(expense => {
        return this.constants.thisMonth(expense)
      })

        title = this.months[d.getMonth()] + " " + d.getFullYear()
        this.exports.exportPdf(this.filteredExpense, title)
        break;

      case '1':
        this.filteredExpense = expenses.filter(expense => {
          return this.constants.lastMonth(expense)
        })
        let sampleExpenseDate = this.filteredExpense[0].date
        title = this.months[sampleExpenseDate.getMonth()] + " " 
        + sampleExpenseDate.getFullYear()
        this.exports.exportPdf(this.filteredExpense,title)
        break;

      case '2': let alert = this.alertCtrl.create({
        title: "Range",
        message: 'Enter your range!',
        inputs: [
          {
            name: "start",
            type: 'date',
            max: new Date().toISOString().slice(0, 10)
          },
          {
            name: "end",
            type: 'date',
            max: new Date().toISOString().slice(0, 10)
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Confirm',
            handler: data => {
              if (data.end != null && data.start != null) {
                let { start, end } = data
                start = new Date(start)
                end = new Date(end)

                if (start > end) {
                  this.constants.presentAlert("Error", "Incorrect range")
                  return false;
                }
                this.filteredExpense = this.constants.filterExpenseByDateRange(expenses, data)
                title = start.getDate() + ", " + this.months[start.getMonth()] + 
                " " + start.getFullYear()+ " to " + end.getDate() + ", " + 
                this.months[end.getMonth()] + " " + end.getFullYear()
                this.exports.exportPdf(this.filteredExpense, title)
              }
              else {
                this.constants.presentAlert("Error", "Fill in the details")
                return false;
              }
            }
          }
        ]
      })

        alert.present()

        break;
      
        case '3': this.exports.exportPdf(expenses, "All Expenses")
        break

      default:
        break;
    }
  }
}
