import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs/Rx';
import { FormControl, Validators, FormGroup } from '@angular/forms';

/*
  Generated class for the AppConstantsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export class Expense {
  name: string;
  price: number;
  category: string;

  constructor(name: string, price: number, category: string) {
    this.name = name;
    this.price = price;
    this.category = category;
  }
}

export class UsernameOrEmailValidator {
  static validUsernameOrEmail(fc: FormControl) {
    let usernamePattern = /^[a-zA-Z]+[0-9]*$/
    let emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+$/
    let bool: boolean = fc.value.match(usernamePattern) ? true : false;
    let bool2: boolean = fc.value.match(emailPattern) ? true : false;
    console.log(bool, bool2);
    if (bool || bool2) {
      return (null)
    }
    else {
      return ({ validUsernameOrEmail: true });
    }
  }
}

export class PasswordValidator {
  // Inspired on: http://plnkr.co/edit/Zcbg2T3tOxYmhxs7vaAm?p=preview
  static areEqual(formGroup: FormGroup) {
    let val;
    let valid = true;
    console.log("I'm here");
    let passWordControl: FormControl = <FormControl>formGroup.controls[3];
    let passWordConfirmControl: FormControl = <FormControl>formGroup.controls[4];
    let password = passWordControl.value;
    let passwordConfirm = passWordConfirmControl.value;
    if (password !== passwordConfirm) {
      valid = false;
      console.log("Should be here")
    }
    if (valid) {
      console.log("Inside allow")
      return null;
    }

    console.log("Not allowed");
    return {
      areEqual: true
    }
  }
}


@Injectable()
export class AppConstantsProvider {
  BASEURL: string = "http://localhost:5000"
  public username = new BehaviorSubject("username");
  public email = new BehaviorSubject("email");

  constructor(private alertCtrl: AlertController,
    private toastCtrl: ToastController, private storage: Storage,
    private loadingCtrl: LoadingController) {
  }

  /* This method takes the userDetails object, converts all
  the expense date strings to dates and sorts the expenses in
  chronological order.
  */
  arrangeUserDetails(userDetails) {
    let expenses = userDetails.expenses
    expenses.forEach(expense => {
      expense.date = new Date(expense.date);
    });
    this.quickSortExpenses(expenses, 0, expenses.length - 1);
    expenses.reverse();
    userDetails.expenses = expenses;
    return userDetails;
  }

  presentAlert(title: string, subTitle: string) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  presentToast(message: string, callback) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      callback;
    });

    toast.present();
  }

  /* This function takes last element as pivot, 
      places the pivot element at its correct 
      position in sorted array, and places all 
      smaller (smaller than pivot) to left of 
      pivot and all greater elements to right 
      of pivot */
  partition(arr: any[], low: number, high: number) {
    let pivot = arr[high].date;
    let i = (low - 1); // index of smaller element 
    for (let j = low; j < high; j++) {
      // If current element is smaller than or 
      // equal to pivot 
      if (arr[j].date <= pivot) {
        i++;

        // swap arr[i] and arr[j] 
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }

    // swap arr[i+1] and arr[high] (or pivot) 
    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    return i + 1;
  }

  quickSortExpenses(expenses: any[], low: number, high: number) {
    if (low < high) {
      /* pi is partitioning index, arr[pi] is  
        now at right place */
      let pi = this.partition(expenses, low, high);

      // Recursively sort elements before 
      // partition and after partition 
      this.quickSortExpenses(expenses, low, pi - 1);
      this.quickSortExpenses(expenses, pi + 1, high);
    }
  }

  thisMonth(expense: any) {
    let d = new Date();
    if (expense.date.getMonth() === d.getMonth() && expense.date.getFullYear()
      === d.getFullYear()) {
      return expense
    }
  }

  lastMonth(expense: any) {
    let d: any = new Date();
    let yearDifference = d.getFullYear() - expense.date.getFullYear();

    if ((expense.date.getMonth() + 1) % 12 === d.getMonth()
      && yearDifference < 2 && (d - expense.date) < 9989118784) {
      return expense
    }
  }
  lastTwoMonths(expense: any) {
    let d: any = new Date();
    let yearDifference = d.getFullYear() - expense.date.getFullYear();

    if ((expense.date.getMonth() + 2) % 12 === d.getMonth()
      && yearDifference < 2 && (d - expense.date) < 9989118784) {
      return expense
    }
  }

}
