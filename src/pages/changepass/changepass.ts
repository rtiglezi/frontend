import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UsuarioService } from '../../services/domain/usuario.service';
import { HomePage } from '../home/home';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-changepass',
  templateUrl: 'changepass.html',
})
export class ChangepassPage {

  email = this.storage.getLocalUser().email;
  formGroup: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: StorageService,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public usuarioService: UsuarioService,
    public alertCtrl: AlertController,
    public auth: AuthService
  ) {
    this.formGroup = this.formBuilder.group({
      email: [this.email, [Validators.required]],
      senha: ['', [Validators.required]],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', '']
    }, {
        validator: this.matchPassword
      });
  }

  matchPassword(ac: AbstractControl) {
    let password = ac.get('novaSenha').value;
    let confirmPassword = ac.get('confirmarSenha').value;
    if (password != confirmPassword) {
      ac.get('confirmarSenha').setErrors({ matchPassword: true })
    } else {
      return null
    }
  }


  ionViewDidLoad() {

  }


  showInsertOk() {
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Cadastro efetuado com sucesso',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loader.present();
    return loader;
  }


  changePass() {
    let loader = this.presentLoading();
    this.usuarioService.changePass(this.formGroup.value)
      .subscribe(response => {
        this.changePassOk();
        loader.dismiss();
      },
        error => {
          loader.dismiss();
        });
  }

  changePassOk() {
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Sua senha foi alterada. Você será redirecionado à tela de login.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.auth.logout();
            this.navCtrl.push(HomePage);
          }
        }
      ]
    });
    alert.present();
  }

}
