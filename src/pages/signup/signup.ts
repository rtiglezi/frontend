import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/domain/usuario.service';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public usuarioService: UsuarioService,
    public alertCtrl: AlertController) {

    this.formGroup = this.formBuilder.group({
      nome: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(80)]],
      email: ['',[Validators.required, Validators.email]],
      login: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      senha: ['',[Validators.required]]
    });

  }

  signupUser() {
    this.usuarioService.insert(this.formGroup.value)
      .subscribe(response => {
        this.showInsertOk();
      },
     error => {});
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
}
