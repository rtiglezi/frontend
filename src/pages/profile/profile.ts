import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { UsuarioDTO } from '../../models/usuario.dto';
import { UsuarioService } from '../../services/domain/usuario.service';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  usuario: UsuarioDTO;
  localUser = this.storage.getLocalUser();

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public storage: StorageService,
      public usuarioService: UsuarioService
    ) {
  }

  ionViewDidLoad() {
    if (this.localUser && this.localUser.email){
      this.usuarioService.findByEmail(this.localUser.email)
        .subscribe(response => {
          this.usuario = response;
        },
        error => {
          if (error.status == 403) {
            this.navCtrl.setRoot('HomePage');
          }
        });
    } else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  isAdmin() : boolean {
    if (this.localUser && this.localUser.perfis.indexOf('ADMIN')!=-1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  goTo(page) {
    this.navCtrl.push(page);
  }

}
