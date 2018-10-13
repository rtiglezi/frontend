import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
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
    private toast: ToastController,
    public loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
    this.read();
  }

  presentLoading(msg: string) {
    let loader = this.loadingCtrl.create({
      content: msg
    });
    loader.present();
    return loader;
  }

  create() {
    this.navCtrl.push('ContaEditPage');
  }

  read() {
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
            let loader = this.presentLoading("Excluindo o registro...");
            this.contaService.delete(obj.id)
              .subscribe(() => {
                let index = this.items.indexOf(obj);
                this.items.splice(index, 1);
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
  }

  goSaldos(obj) {
    this.navCtrl.push('SaldoPage', obj);
  }

  goGrafico(obj) {
    let arrayMeses = [];
    let arrayReceitasCorrentes = [];
    let arrayDespesasCorrentes = [];
    this.contaService.getSaldosByConta(obj.id)
      .subscribe(response => {
        response.map(r => {
          arrayMeses.push(r["mesDescricao"].substring(0,3) + "/" + r["ano"]);
          arrayReceitasCorrentes.push(r["somaReceitasCorrentes"]);
          arrayDespesasCorrentes.push(r["somaDespesasCorrentes"]);
        })
        this.navCtrl.push('GraficoPage', {
          meses: arrayMeses,
          receitas: arrayReceitasCorrentes,
          despesas: arrayDespesasCorrentes
        });
      },
        error => {
          if (error.status == 403) {
          }
        });
  }

}