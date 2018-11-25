import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { AuthProvider } from '../providers/auth/auth';
import { AppConstantsProvider } from '../providers/app-constants/app-constants';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { UserActionsProvider } from '../providers/user-actions/user-actions';
import { ExpenseGroupsPage } from '../pages/expense-groups/expense-groups';
import { CategoryGroupsPage } from '../pages/category-groups/category-groups';
import { ExpensesPage } from '../pages/expenses/expenses';
import { LongPressModule } from 'ionic-long-press';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { ExpenseStatisticsPage } from '../pages/expense-statistics/expense-statistics';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ExpenseGroupsPage,
    CategoryGroupsPage,
    ExpensesPage,
    MyProfilePage,
    ExpenseStatisticsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    LongPressModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ExpenseGroupsPage,
    CategoryGroupsPage,
    ExpensesPage,
    MyProfilePage,
    ExpenseStatisticsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    AppConstantsProvider,
    UserActionsProvider
  ]
})
export class AppModule {}
