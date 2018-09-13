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
  ultimoSaldo: Object[] = [];
  
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
      response.map(m=>{
        this.montaSaldo(m.id);
      });
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


  montaSaldo(contaId : string) {
    this.contaService.lastSaldo(contaId)
      .subscribe(response  => {
        if (response.length > 0) {
          let obj = {conta: contaId, ano: response[response.length-1].ano, mes: response[response.length-1].mesDescricao, saldo: response[response.length-1].saldoMes};
          this.ultimoSaldo.push(obj);
        }
        else {
          let obj = {conta: contaId, saldo: null};
          this.ultimoSaldo.push(obj);
        }
     },
     error => {
        if (error.status == 403) {
        
      }
    });
  }

  mostraAtualizacao(conta, item, ano, mes, saldo)  {
      if (conta == item) {
          if (saldo)
          {
            return "Último saldo: R$ " + saldo + " (" + mes + "/" + ano + ")";
          } else {
            return "Sem registro de saldo.";
          }
      }
  }

}
