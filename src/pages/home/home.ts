import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../config/api.config';

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
    public auth: AuthService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public http: HttpClient,
    private toastCtrl: ToastController
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
    let loader = this.presentLoading();
    this.auth.authenticate(this.creds)
    .subscribe(response => {
      this.auth.succefulLogin(response.headers.get('Authorization'));
      this.navCtrl.setRoot('ProfilePage');
    loader.dismiss();
    },
    error => {
      loader.dismiss();
    });
  }


  signup() {
    this.navCtrl.push('SignupPage');
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();
    return loader;
  }


  esqueciSenha(){
    let alert = this.alertCtrl.create({
      title: "Resetar a senha.",
      inputs: [
        {
          name: 'email',
          placeholder: 'seu e-mail'
        }
      ],
      message: "Ao continuar, sua senha será resetada. Para prosseguir, informe o seu e-mail:",
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Resetar minha senha',
          handler: data => {
            this.http.post(
              `${API_CONFIG.baseUrl}/auth/forgot`,
              {
                "email" : data.email 
              },
              {
                  observe: 'response',
                  responseType: 'text'
              }
            ).subscribe(response => {
                this.presentToast();  
            },
           error => {});
          }
        },
        {
          text: "Cancelar"
        }
      ]
    });
    alert.present();
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Uma nova senha foi enviada para o e-mail informado.',
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

}
