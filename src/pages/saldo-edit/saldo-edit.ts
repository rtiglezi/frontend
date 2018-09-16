import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
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

  arrayAnos : String[] = [];
  data = new Date();
  ano = this.data.getFullYear();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public modelService: SaldoService,
    public formBuilder: FormBuilder,
    public storage: StorageService,
    private toast: ToastController,
    public events: Events
  ) {
    this.createForm();
    this.populaAnos();
  }

  checkSel(yearFromView : number) : boolean {
    if (this.navParams.data.ano){
      if (yearFromView == this.navParams.data.ano){
        this.ano = yearFromView;
        return true;
      } else {
        return false;
      }
    } else {
      if (yearFromView == this.ano){
        return true;
      } else {
        return false;
      }
    }
  }

  populaAnos(){
    for (let _x = this.ano; _x >= this.ano-20; _x--){
      this.arrayAnos.push(_x.toString());
    }
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
      somaDespesasCorrentes: [this.navParams.data.somaDespesasCorrentes,''],
      conta:                 [this.navParams.data.conta,''],
    });
  }


  ionViewDidLoad() {
    this.isNewData();
  }
  
  
  isNewData() : boolean {
    if (this.navParams.data.isNewData) {
      this.lblButton = "Adicionar Saldo";
      this.formGroup.value.id = null;
      this.formGroup.value.conta = { 
        "id" : this.navParams.data.id,
        "nome" : this.navParams.data.nome,
        "tipoContaDescricao" : this.navParams.data.tipoContaDescricao 
      };
      return true;
    } else {
      this.lblButton = "Editar Saldo";
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
    this.events.publish('reloadDetails');
    this.navCtrl.setRoot('ContaPage');
    this.formGroup.value.conta.ano = this.ano;
    this.navCtrl.push('SaldoPage', this.formGroup.value.conta);
  } 

}
