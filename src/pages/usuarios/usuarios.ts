import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
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
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
   this.loadData();
  }

  loadData() {
    let loader = this.presentLoading();
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

  
  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Carregando..."
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
