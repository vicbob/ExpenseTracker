import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, MenuController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UsernameOrEmailValidator, PasswordValidator } from '../../providers/app-constants/app-constants';

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
  passwordConfirm: string;
  username: string;
  resetPasswordView: boolean = false;
  registerView: boolean = false;
  loginForm: FormGroup;
  registerForm: FormGroup;

  validation_messages = {
    username: [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your username must contain only letters and may end with numbers.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'minlength', message: 'Email must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Email cannot be more than 25 characters long.' },
      { type: 'email', message: 'Email must be valid' }
    ],
    usernameOrEmail: [
      { type: 'required', message: 'Username or Email is required.' },
      { type: 'minlength', message: 'Username or Email must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username or Email cannot be more than 40 characters long.' },
      {
        type: 'validUsernameOrEmail', message: 'Your username must contain only letters and may end with numbers, ' +
          'Email must be a valid email'
      }
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Password cannot be more than 25 characters long.' },
    ],
  }

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

    this.registerForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email,
        Validators.maxLength(40),
        Validators.minLength(5),
      ])
      ],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25),
        Validators.pattern('[a-zA-Z]+[0-9]*')
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(25),
        Validators.minLength(5),
      ])
      ],
      passwordConfirm: ['', Validators.required]
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.menu.enable(false);
  }


  async login() {
    if (!this.loginForm.valid) return false;
    const loader = this.loadingctrl.create({
      content: "Please wait...."
    })
    loader.present();
    console.log(this.loginForm);
    let { usernameOrEmail, password } = this.loginForm.value;
    console.log("Email is ", usernameOrEmail, " and password is ", password);
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
    if(!this.registerForm.valid) return false;
    const loader = this.loadingctrl.create({
      content: "Please wait...."
    })
    loader.present();
    let {username,email,password} = this.registerForm.value;
    this.auth.register(username, email, password)
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
