import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ContaDTO } from '../../models/conta.dto';
import { ContaService } from '../../services/domain/conta.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-conta-edit',
  templateUrl: 'conta-edit.html',
})
export class ContaEditPage {
  
  model: ContaDTO;
  formGroup: FormGroup;
  lblButton = "";
 
  
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams, 
      public modelService: ContaService,
      public formBuilder: FormBuilder,
      public storage: StorageService,
      private toast: ToastController
    ) {
    this.createForm();
  }
  
   

  createForm(){
    this.formGroup = this.formBuilder.group({
      id:        [this.navParams.data.id,''],
      nome:      [this.navParams.data.nome, [Validators.required, Validators.minLength(5), Validators.maxLength(80)]],
      tipoConta: [this.navParams.data.tipoConta, [Validators.required]]
    });
  }

  ionViewDidLoad() {
    this.isNewData();
  }
  
  
  isNewData() : boolean {
    if (!this.formGroup.value.id) {
      this.lblButton = "Adicionar Conta"
      return true;
    } else {
      this.lblButton = "Editar Conta"
      return false;
    }
  }


  save(){
    if (this.isNewData()) {
      
     this.modelService.create(this.formGroup.value)
     .subscribe(() => {
      this.showOk("Registro adicionado com sucesso.");
      }, () => {});

      console.log(this.formGroup.value);
    
      
    } else {
  
      this.modelService.update(this.formGroup.value)
      .subscribe(() => {
        this.showOk("Registro editado com sucesso.");
       }, () => {});

       console.log(this.formGroup.value);

    }
  }


  showOk(msg) {
    this.toast.create({ message: msg, position: 'bottom', duration: 2000 }).present();
    this.navCtrl.setRoot('ContaPage');
  } 

}
