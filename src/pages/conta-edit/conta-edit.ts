import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ContaDTO } from '../../models/conta.dto';
import { ContaService } from '../../services/domain/conta.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-conta-edit',
  templateUrl: 'conta-edit.html',
})
export class ContaEditPage {
  
  model: ContaDTO;
  formGroup: FormGroup;
  lblButton = "ddd";
  
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams, 
      public modelService: ContaService,
      public formBuilder: FormBuilder,
      private toast: ToastController
  ) {

      this.formGroup = this.formBuilder.group({
        id:   [navParams.data.id,''],
        nome: [navParams.data.nome, [Validators.required, Validators.minLength(5), Validators.maxLength(80)]]
      });

    }
  
  ionViewDidLoad() {
    this.isNewData();
  }
  
  
  isNewData() : boolean {
    if (!this.formGroup.value.id) {
      this.lblButton = "Inserir"
      return true;
    } else {
      this.lblButton = "Editar"
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
    this.toast.create({ message: msg, position: 'middle', duration: 2000 }).present();
    this.navCtrl.push('ContaPage');
  } 


}
