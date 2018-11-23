import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, MenuController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UsernameOrEmailValidator } from '../../providers/app-constants/app-constants';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email: string;
  password: string;
  username: string;
  resetPasswordView: boolean = false;
  registerView: boolean = false;
  loginForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private auth: AuthProvider, private alertCtrl: AlertController,
    private storage: Storage, private loadingctrl: LoadingController,
    public menu: MenuController, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      usernameOrEmail: ['', Validators.compose([
        Validators.required,
        UsernameOrEmailValidator.validUsernameOrEmail,
        Validators.maxLength(40),
        Validators.minLength(5),
      ])
      ],
      password: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(25),
        Validators.minLength(5),
      ])
      ]
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.menu.enable(false);
  }


  async login() {
    if(!this.loginForm.valid) return false;
    const loader = this.loadingctrl.create({
      content: "Please wait...."
    })
    loader.present();
    console.log(this.loginForm);
    let {usernameOrEmail,password} = this.loginForm.value;
    console.log("Email is ", usernameOrEmail, " and password is ",password);
    try {
      let resp = await this.auth.login(usernameOrEmail, password)
      this.storage.set('token', resp.access_token);
      loader.dismiss();
      this.navCtrl.setRoot(HomePage);
    }
    catch (error) {
      loader.dismiss();
      let subTitle;
      if (error.error.description === undefined) {
        subTitle = "Connection error. Check your internet connection"
      }
      else {
        subTitle = error.error.description + ". Check your username and password"
      }
      const alert = this.alertCtrl.create({
        title: "Error",
        subTitle: subTitle,
        buttons: ['OK']
      });
      alert.present();
    }
  }


  register() {
    const loader = this.loadingctrl.create({
      content: "Please wait...."
    })
    loader.present();
    this.auth.register(this.username, this.email, this.password)
      .then(resp => {
        loader.dismiss();
        const alert = this.alertCtrl.create({
          title: "Success",
          subTitle: resp.message,
          buttons: ['OK']
        })
        alert.present();
        this.navCtrl.setRoot(LoginPage);
      })
      .catch(error => {
        loader.dismiss();
        const alert = this.alertCtrl.create({
          title: "Error",
          subTitle: error.error.message,
          buttons: ['OK']
        })
        alert.present();
      })
  }


  resetPassword() {
    const loader = this.loadingctrl.create({
      content: "Please wait...."
    })
    loader.present();
    this.auth.resetPassword(this.email).then(resp => {
      loader.dismiss();
      const alert = this.alertCtrl.create({
        title: "Message sent",
        subTitle: resp.message,
        buttons: ['OK']
      });
      alert.present();
    }).catch(error => {
      loader.dismiss();
      const alert = this.alertCtrl.create({
        title: "Error",
        subTitle: error.error.message,
        buttons: ['OK']
      })
      alert.present();
    })
    this.navCtrl.setRoot(LoginPage);
  }


  toggleRegisterView() {
    this.registerView = !this.registerView;
  }


  toggleResetPasswordView() {
    this.resetPasswordView = !this.resetPasswordView;
  }
}
