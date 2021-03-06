import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ExpensesPage } from '../expenses/expenses';
import { AppConstantsProvider, Expense } from '../../providers/app-constants/app-constants';
import { UserActionsProvider } from '../../providers/user-actions/user-actions';

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
  loader = this.loadingCtrl.create({
    content: "Please wait...."
  });

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController, private constants: AppConstantsProvider,
    private userActions: UserActionsProvider, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseGroupsPage');
  }

  async afterActionCallback() {
    await this.userActions.getDetails("Refreshing. Please wait....");
    this.openPage(0, "This Month")
  }

  async addExpense(expense: Expense) {
    let loader = this.loadingCtrl.create({
      content: "Please wait...."
    });
    loader.present();
    try {
      let resp: any = await this.userActions.addExpense(expense);
      loader.dismiss();
      this.constants.presentToast(resp.message,
        this.afterActionCallback());
    } catch (error) {
      loader.dismiss();
      console.log("The Add expense error is ", error)
      this.constants.presentAlert("Error", error.message);
    }
  }

  openPage(num: number, title: string,data:any={}) {
    this.navCtrl.push(ExpensesPage, { 'case': num, 'title': title, data:data });
  }

  presentAddExpensePrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Add New Expense',
      inputs: [
        {
          name: "name",
          placeholder: "name",
          type: "text"
        },
        {
          name: "price",
          placeholder: "price",
          type: "number"
        },
        {
          name: 'category',
          placeholder: "[category]",
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
          text: 'Submit',
          handler: data => {
            var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
            var format2 = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
            let bool: boolean = data.category.match(format2) ? true : false;
            bool = bool || data.category.trim().toLowerCase() == "uncategorized" ? true : false;

            let bool2: boolean = data.price < 5 ? true : false;
            bool2 = bool2 || data.price.trim() == "" ? true : false

            let bool3: boolean = data.name.match(format) ? true : false;
            bool3 = bool3 || data.name.trim() == "" ? true : false;

            if (bool || bool2 || bool3) {
              console.log(bool, bool2, bool3);
              let message: string = "Invalid field";

              if (data.category.trim().toLowerCase() == "uncategorized") {
                message = message.concat(". Category cannot be uncategorized");
              }

              this.constants.presentAlert("Error", message);
              return false;
            }

            try {
              let category = data.category.trim();
              if (category == "") category = null;

              let expense = new Expense(data.name.trim(),
                data.price, category)
              this.addExpense(expense);
            } catch (error) {
              console.log("Error when calling add expense function is ", error);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  async presentRangePrompt(char: string) {
    let alert = this.alertCtrl.create({
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
              this.openPage(6,"Expense",data)
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
  }
}



