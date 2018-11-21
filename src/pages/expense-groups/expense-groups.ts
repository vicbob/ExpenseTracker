import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ExpensesPage } from '../expenses/expenses';
import { AppConstantsProvider,Expense } from '../../providers/app-constants/app-constants';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController, private constants:AppConstantsProvider,
    private userActions:UserActionsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseGroupsPage');
  }

  async afterActionCallback(){
    await this.userActions.getDetails("Refreshing. Please wait....");
    this.openPage(0,"This Month")
  }

  async addExpense(expense:Expense) {
    try{
      let resp:any = await this.userActions.addExpense(expense);
      this.constants.presentToast(resp.message,
        this.afterActionCallback());
       }catch(error){
         console.log("The Add expense error is ",error)
        this.constants.presentAlert("Error",error.message);
       }
  }

  openPage(num: number, title: string) {
    this.navCtrl.push(ExpensesPage, { 'case': num, 'title': title });
  }

  presentAddExpensePrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Add New Expense',
      inputs: [
        {
          name:"name",
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
            var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
            let bool: boolean = data.category.match(format) ? true : false;
            //bool = bool || data.category.trim() == "" ? true : false;

            let bool2: boolean = data.price < 5 ? true : false;
            bool2 = bool2 || data.price.trim() == "" ? true : false

            let bool3:boolean = data.name.match(format)? true:false;
            bool3 = bool3 || data.name.trim() ==""? true:false;

            if (bool || bool2) {
              this.constants.presentAlert("Error", "Invalid field");
              return false;
            }

            try {
              let expense = new Expense(data.name.trim(),
              data.price,data.category.trim())
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

}

