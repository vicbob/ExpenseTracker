import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryGroupsPage } from './category-groups';

@NgModule({
  declarations: [
    CategoryGroupsPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoryGroupsPage),
  ],
})
export class CategoryGroupsPageModule {}
