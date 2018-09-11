import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { ContaService } from '../../services/domain/conta.service';
import { ContaDTO } from '../../models/conta.dto';


@IonicPage()
@Component({
  selector: 'page-conta',
  templateUrl: 'conta.html',
})
export class ContaPage {

  items: ContaDTO[] = [];
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public contaService: ContaService,
    public alertCtrl: AlertController,
    private toast: ToastController
  ) {
  }

  ionViewDidLoad() {
    this.read();
  }

  create() {
    this.navCtrl.push('ContaEditPage');
  }
  
  read(){
    this.contaService.readAll()
    .subscribe(response => {
      this.items = response;
    },
    error => {
      if (error.status == 403) {
        
      }
    });
  }

  update(obj) {
    this.navCtrl.push('ContaEditPage', obj);
  }

  delete(obj) {
    let alert = this.alertCtrl.create({
      title: "Exclusão de registro.",
      message: "Deseja realmente excluir?",
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.contaService.delete(obj.id)
            .subscribe(() => {
              let index = this.items.indexOf(obj);
              this.items.splice(index, 1);
              this.showOk("Registro deletado com sucesso.");
            },
            () => {
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

  showOk(msg) {
    this.toast.create({ message: msg, position: 'middle', duration: 2000 }).present();
    this.navCtrl.setRoot('ContaPage');
  } 

}
