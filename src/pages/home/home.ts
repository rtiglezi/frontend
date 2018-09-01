import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds : CredenciaisDTO = {
    email : "",
    senha : ""
  }

  constructor(
    public navCtrl: NavController, 
    public menu: MenuController,
    public auth: AuthService
  ) {
    
  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }
  
  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  ionViewDidEnter(){
    this.auth.refreshToken()
    .subscribe(response => {
      this.auth.succefulLogin(response.headers.get('Authorization'));
      this.navCtrl.setRoot('UsuariosPage');
    },
    error => {});
  }

  login() {
    this.auth.authenticate(this.creds)
    .subscribe(response => {
      this.auth.succefulLogin(response.headers.get('Authorization'));
      this.navCtrl.setRoot('ProfilePage');
    },
    error => {});
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

}
