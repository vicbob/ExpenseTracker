import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpenseGroupsPage } from './expense-groups';

@NgModule({
  declarations: [
    ExpenseGroupsPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpenseGroupsPage),
  ],
})
export class ExpenseGroupsPageModule {}
