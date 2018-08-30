import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsuarioService } from '../../services/domain/usuario.service';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../config/api.config';
import { UsuarioDTO } from '../../models/usuario.dto';

@IonicPage()
@Component({
  selector: 'page-usuarios',
  templateUrl: 'usuarios.html',
})
export class UsuariosPage {

  items: UsuarioDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public usuarioService: UsuarioService,
    public http: HttpClient) {
  }

  ionViewDidLoad() {
    this.usuarioService.findAll()
      .subscribe(response => {
        this.items = response;
      },
      error => {
        if (error.status == 403) {
          this.navCtrl.setRoot('HomePage');
        }
      });
  }

  

  

}
