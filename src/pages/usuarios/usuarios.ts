import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UsuarioService } from '../../services/domain/usuario.service';
import { HttpClient } from '@angular/common/http';
import { UsuarioDTO } from '../../models/usuario.dto';

@IonicPage()
@Component({
  selector: 'page-usuarios',
  templateUrl: 'usuarios.html',
})
export class UsuariosPage {

  items: UsuarioDTO[] = [];
  page: number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public usuarioService: UsuarioService,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
   this.loadData();
  }

  loadData() {
    let loader = this.presentLoading("Carregando os usuários cadastrados...");
    this.usuarioService.findPage(this.page, 20)
      .subscribe(response => {
        this.items = this.items.concat(response["content"]);
        loader.dismiss();
        console.log(this.items.length, this.page);
      },
      error => {
        if (error.status == 403) {
          this.navCtrl.setRoot('HomePage');
          loader.dismiss();
        }
      });
  }

  delete(obj) {
    let alert = this.alertCtrl.create({
      title: "Exclusão de registro.",
      message: "Deseja realmente excluir este usuário?",
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            let loader = this.presentLoading("Excluindo o registro...");
            this.usuarioService.delete(obj.id)
            .subscribe(response => {
              let index = this.items.indexOf(obj);
              this.items.splice(index, 1);
              loader.dismiss();
              this.restOk("Sucesso.", "O usuário foi deletado.");
            },
            error => {
              loader.dismiss();
            });
          }
        },
        {
          text: "Não"
        }
      ]
    });
    alert.present();
  }

  restOk(ttl : string, msg : string) {
    let alert = this.alertCtrl.create({
      title: ttl,
      message: msg,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }
  
  presentLoading(msg : string) {
    let loader = this.loadingCtrl.create({
      content: msg
    });
    loader.present();
    return loader;
  }
  
  doRefresh(refresher){
    this.page = 0;
    this.items = [];
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.loadData();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 500);
  }

}
