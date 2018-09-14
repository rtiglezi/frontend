import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { SaldoService } from '../../services/domain/saldo.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { SaldoDTO } from '../../models/saldo.dto';


@IonicPage()
@Component({
  selector: 'page-saldo-edit',
  templateUrl: 'saldo-edit.html',
})
export class SaldoEditPage {

  model: SaldoDTO;
  formGroup: FormGroup;
  lblButton = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public modelService: SaldoService,
    public formBuilder: FormBuilder,
    public storage: StorageService,
    private toast: ToastController
  ) {
    this.createForm();
  }

  createForm(){
    this.formGroup = this.formBuilder.group({
      id:                    [this.navParams.data.id,''],
      mes:                   [this.navParams.data.mes,''],
      ano:                   [this.navParams.data.ano, Validators.required],
      saldoMesAnterior:      [this.navParams.data.saldoMesAnterior,''],
      somaReceitasCorrentes: [this.navParams.data.somaReceitasCorrentes,''],
      somaReceitasExtras:    [this.navParams.data.somaReceitasExtras,''],
      saldoMes:              [this.navParams.data.saldoMes,''],
      somaGastosExtras:      [this.navParams.data.somaGastosExtras,''],
      somaInvestimentos:     [this.navParams.data.somaInvestimentos,''],
      conta:                 [this.navParams.data.conta,''],
    });
  }


  ionViewDidLoad() {
    //console.log(this.navParams.data);
    this.isNewData();
  }
  
  
  isNewData() : boolean {
    if (!this.formGroup.value.id) {
      this.lblButton = "Adicionar Saldo"
      return true;
    } else {
      this.lblButton = "Editar Saldo"
      return false;
    }
  }


  save(){
    if (this.isNewData()) {
      
     this.modelService.create(this.formGroup.value)
     .subscribe(() => {
      this.showOk("Registro adicionado com sucesso.");
      }, () => {});
      
    } else {
  
      this.modelService.update(this.formGroup.value)
      .subscribe(() => {
        this.showOk("Registro editado com sucesso.");
       }, () => {});

    }
  }


  showOk(msg) {
    this.toast.create({ message: msg, position: 'bottom', duration: 2000 }).present();
    this.navCtrl.setRoot('ContaPage');
  } 

}
