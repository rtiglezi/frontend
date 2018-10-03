import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, ToastController, LoadingController } from 'ionic-angular';
import { ContaService } from '../../services/domain/conta.service';
import { SaldoDTO } from '../../models/saldo.dto';
import { SaldoService } from '../../services/domain/saldo.service';

@IonicPage()
@Component({
  selector: 'page-saldo',
  templateUrl: 'saldo.html',
})
export class SaldoPage {
  
  paramFromConta : SaldoDTO[] = []
  arraySaldos = [];
 
  arrayAnos : String[] = [];
  data = new Date();
  
  ano = this.data.getFullYear();


    
  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public contaService: ContaService,
      public saldoService: SaldoService,
      public alertCtrl: AlertController,
      public events: Events,
      private toast: ToastController,
      public loadingCtrl: LoadingController
    ) {
      this.populaAnos();
  }

  presentLoading(msg : string) {
    let loader = this.loadingCtrl.create({
      content: msg
    });
    loader.present();
    return loader;
  }

  checkSel(a : string) : boolean{
    if (a == this.ano.toString()){
      return true;
    } else {
      return false;
    }
  }

  populaAnos(){
    for (let _x = this.ano; _x >= this.ano-20; _x--){
      this.arrayAnos.push(_x.toString());
    }
    if (this.navParams.data.ano) {
      this.ano = this.navParams.data.ano;
    }
  }

  onSelectChange(e){
    this.ano = e;
    this.read(this.navParams.data.id, e);
  }

  ionViewDidLoad() {
    this.paramFromConta = this.navParams.data;
    this.read(this.navParams.data.id, this.ano);
  }

  read(id, ano){
    this.contaService.lastSaldo(id, ano)
    .subscribe(response => {
      this.arraySaldos = response;
    },
    error => {
      if (error.status == 403) {
      }
    });
  }

  create() {
    this.paramFromConta["isNewData"] = true;
    this.paramFromConta["ano"] = this.ano;
    this.navCtrl.push('SaldoEditPage', this.paramFromConta);
  }


  update(itemFromView) {
    delete itemFromView.conta.usuario;
    this.navCtrl.push('SaldoEditPage', itemFromView);
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
            let loader = this.presentLoading("Excluindo o registro...");
            this.saldoService.delete(obj.id)
            .subscribe(() => {
              let index = this.arraySaldos.indexOf(obj);
              this.arraySaldos.splice(index, 1);
              loader.dismiss();
              this.showOk("Registro deletado com sucesso.");
            },
            () => {
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

  showOk(msg) {
    this.toast.create({ message: msg, position: 'bottom', duration: 2000 }).present();
    this.navCtrl.setRoot('ContaPage');
    this.paramFromConta["ano"] = this.ano;
    this.navCtrl.push('SaldoPage', this.paramFromConta);
  } 

  getFormattedPrice(price: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
}

}
