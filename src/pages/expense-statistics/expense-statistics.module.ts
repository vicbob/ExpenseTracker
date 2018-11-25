import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpenseStatisticsPage } from './expense-statistics';

@NgModule({
  declarations: [
    ExpenseStatisticsPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpenseStatisticsPage),
  ],
})
export class ExpenseStatisticsPageModule {}
