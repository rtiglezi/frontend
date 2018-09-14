import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContaService } from '../../services/domain/conta.service';
import { SaldoDTO } from '../../models/saldo.dto';

@IonicPage()
@Component({
  selector: 'page-saldo',
  templateUrl: 'saldo.html',
})
export class SaldoPage {
  item : SaldoDTO[] = []
  itemsSaldo = [];

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public contaService: ContaService,
    ) {
  }

  ionViewDidLoad() {
    this.item = this.navParams.data;
    this.read(this.navParams.data.id);
    
  }


  read(id){
    this.contaService.lastSaldo(id)
    .subscribe(response => {
      this.itemsSaldo = response;
    },
    error => {
      if (error.status == 403) {
        
      }
    });
  }

  create() {
    this.navCtrl.push('SaldoEditPage');
  }


  update(obj) {
    this.navCtrl.push('SaldoEditPage', obj);
  }

}
