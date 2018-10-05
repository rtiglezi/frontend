import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, LoadingController } from 'ionic-angular';
import { SaldoService } from '../../services/domain/saldo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { SaldoDTO } from '../../models/saldo.dto';

@IonicPage()
@Component({
  selector: 'page-saldo-edit',
  templateUrl: 'saldo-edit.html',
})
export class SaldoEditPage {

  @ViewChild('saldoMes') domSaldoMes: ElementRef;
  @ViewChild('saldoMesAnterior') domSaldoMesAnterior: ElementRef;
  @ViewChild('somaDespesasCorrentes') domSomaDespesasCorrentes: ElementRef;
  @ViewChild('somaReceitasCorrentes') domSomaReceitasCorrentes: ElementRef;
  @ViewChild('somaReceitasExtras') domSomaReceitasExtras: ElementRef;
  @ViewChild('somaGastosExtras') domSomaGastosExtras: ElementRef;
  @ViewChild('somaInvestimentos') domSomaInvestimentos: ElementRef;

  @ViewChild('sinalSMA') domSinalSMA: ElementRef;
  @ViewChild('sinalSM') domSinalSM: ElementRef;

  @ViewChild('mes') domMes: ElementRef;

  model: SaldoDTO;
  formGroup: FormGroup;
  lblButton = "";
  disabledMes = false;
  inconsistentValue = false;


  arrayAnos: String[] = [];
  data = new Date();
  ano = this.data.getFullYear();
  //mes = this.data.getMonth() + 1;
  mes = null;
  saldoMesAnterior = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modelService: SaldoService,
    public formBuilder: FormBuilder,
    public storage: StorageService,
    private toast: ToastController,
    public events: Events,
    public loadingCtrl: LoadingController
  ) {
    this.createForm();
    this.populaAnos();
  }

  presentLoading(msg: string) {
    let loader = this.loadingCtrl.create({
      content: msg
    });
    loader.present();
    return loader;
  }

  checkSel(yearFromView: number): boolean {
    if (this.navParams.data.ano) {
      if (yearFromView == this.navParams.data.ano) {
        this.ano = yearFromView;
        return true;
      } else {
        return false;
      }
    } else {
      if (yearFromView == this.ano) {
        return true;
      } else {
        return false;
      }
    }
  }

  populaAnos() {
    for (let _x = this.ano; _x >= this.ano - 20; _x--) {
      this.arrayAnos.push(_x.toString());
    }
  }

  createForm() {

    if (this.navParams.data.mes) {
      this.mes = this.navParams.data.mes;
    }

    this.formGroup = this.formBuilder.group({
      id: [this.navParams.data.id, ''],
      mes: [this.mes, Validators.required],
      ano: [this.navParams.data.ano, ''],

      saldoMesAnterior: [this.getFormatFromBuilder(this.navParams.data.saldoMesAnterior), ''],
      saldoMes: [this.getFormatFromBuilder(this.navParams.data.saldoMes), ''],
      somaReceitasCorrentes: [this.getFormatFromBuilder(this.navParams.data.somaReceitasCorrentes), ''],
      somaReceitasExtras: [this.getFormatFromBuilder(this.navParams.data.somaReceitasExtras), ''],
      somaGastosExtras: [this.getFormatFromBuilder(this.navParams.data.somaGastosExtras), ''],
      somaInvestimentos: [this.getFormatFromBuilder(this.navParams.data.somaInvestimentos), ''],
      somaDespesasCorrentes: [this.getFormatFromBuilder(this.navParams.data.somaDespesasCorrentes), ''],
      conta: [this.navParams.data.conta, ''],
    });
  }


  ionViewDidLoad() {
    if (this.navParams.data.saldoMesAnterior) {
      if (this.navParams.data.saldoMesAnterior.toString().indexOf("-") != -1) {
        this.setNegativo('sma');
      }
    }
    if (this.navParams.data.saldoMes) {
      if (this.navParams.data.saldoMes.toString().indexOf("-") != -1) {
        this.setNegativo('sm');
      }
    }
    this.writePreviousBalance();
    this.inconsistentValue = false;
  }


  isNewData(): boolean {
    if (this.navParams.data.isNewData) {
      this.lblButton = "Adicionar Saldo";
      this.formGroup.value.id = null;
      this.formGroup.value.conta = {
        "id": this.navParams.data.id,
        "nome": this.navParams.data.nome,
        "tipoContaDescricao": this.navParams.data.tipoContaDescricao
      };
      return true;
    } else {
      this.lblButton = "Editar Saldo";
      this.disabledMes = true;
      return false;
    }
  }

  changeNumberFormat() {
    this.formGroup.value.saldoMesAnterior = this.domSaldoMesAnterior.nativeElement.value.replace(".", "").replace(",", ".");
    this.formGroup.value.saldoMes = this.domSaldoMes.nativeElement.value.replace(".", "").replace(",", ".");
    this.formGroup.value.somaReceitasCorrentes = this.domSomaReceitasCorrentes.nativeElement.value.replace(".", "").replace(",", ".");
    this.formGroup.value.somaReceitasExtras = this.domSomaReceitasExtras.nativeElement.value.replace(".", "").replace(",", ".");
    this.formGroup.value.somaGastosExtras = this.domSomaGastosExtras.nativeElement.value.replace(".", "").replace(",", ".");
    this.formGroup.value.somaInvestimentos = this.domSomaInvestimentos.nativeElement.value.replace(".", "").replace(",", ".");
    this.formGroup.value.somaDespesasCorrentes = this.domSomaDespesasCorrentes.nativeElement.value.replace(".", "").replace(",", ".");
  }

  save() {

    this.changeNumberFormat();

    if (this.isNewData()) {
      let loader = this.presentLoading("Inserindo o registro...");
      this.modelService.create(this.formGroup.value)
        .subscribe(() => {
          loader.dismiss();
          this.showOk("Registro adicionado com sucesso.");
        }, () => {
          loader.dismiss();
        });

    } else {
      let loader = this.presentLoading("Alterando o registro...");
      this.modelService.update(this.formGroup.value)
        .subscribe(() => {
          loader.dismiss();
          this.showOk("Registro editado com sucesso.");
        }, () => {
          loader.dismiss();
        });
    }
  }


  showOk(msg) {
    this.toast.create({ message: msg, position: 'bottom', duration: 2000 }).present();
    this.events.publish('reloadDetails');
    this.navCtrl.setRoot('ContaPage');
    this.formGroup.value.conta.ano = this.ano;
    this.navCtrl.push('SaldoPage', this.formGroup.value.conta);
  }


  updateValues() {

    let saldoMesAnterior = this.domSaldoMesAnterior.nativeElement.value.replace(".", "").replace(",", "");
    saldoMesAnterior = saldoMesAnterior / 100;
    if (saldoMesAnterior == 0) {
      this.setPositivo('sma');
    }

    let saldoMes = this.domSaldoMes.nativeElement.value.replace(".", "").replace(",", "");
    saldoMes = saldoMes / 100;
    if (saldoMes == 0) {
      this.setPositivo('sm');
    }

    let somaReceitasCorrentes = this.domSomaReceitasCorrentes.nativeElement.value.replace(".", "").replace(",", "");
    somaReceitasCorrentes = somaReceitasCorrentes / 100;

    let somaReceitasExtras = this.domSomaReceitasExtras.nativeElement.value.replace(".", "").replace(",", "");
    somaReceitasExtras = somaReceitasExtras / 100;

    let somaGastosExtras = this.domSomaGastosExtras.nativeElement.value.replace(".", "").replace(",", "");
    somaGastosExtras = somaGastosExtras / 100;

    let somaInvestimentos = this.domSomaInvestimentos.nativeElement.value.replace(".", "").replace(",", "");
    somaInvestimentos = somaInvestimentos / 100;

    let receitas = somaReceitasCorrentes + somaReceitasExtras;
    let gastos = somaGastosExtras + somaInvestimentos;
    let gastosCorrentes = (((saldoMesAnterior + receitas) - gastos) - saldoMes);
    this.domSomaDespesasCorrentes.value = gastosCorrentes;

    if ( gastosCorrentes < 0 ) {
      this.inconsistentValue = true;
    
    } else {
      this.inconsistentValue = false;
    }

    this.domSomaDespesasCorrentes.valueIonInput = this.domSomaDespesasCorrentes.value;

    this.domSomaDespesasCorrentes.nativeElement.value = this.getFormatFromBuilder(gastosCorrentes.toFixed(2));

  }

  setNegativo(campo) {
    if (campo === 'sma') {
      this.domSaldoMesAnterior.nativeElement.value = "-" + this.domSaldoMesAnterior.nativeElement.value.toString().replace("-", "");
      this.domSaldoMesAnterior.nativeElement.style.color = "red";
      this.domSaldoMesAnterior.nativeElement.style.background = "rgba(253, 1, 1, 0.062)";
    }
    if (campo === 'sm') {
      this.domSaldoMes.nativeElement.value = "-" + this.domSaldoMes.nativeElement.value.toString().replace("-", "");
      this.domSaldoMes.nativeElement.style.color = "red";
      this.domSaldoMes.nativeElement.style.background = "rgba(253, 1, 1, 0.062)";
    }
  }

  setPositivo(campo) {
    if (campo === 'sma') {
      this.domSaldoMesAnterior.nativeElement.value = this.domSaldoMesAnterior.nativeElement.value.replace("-", "");
      this.domSaldoMesAnterior.nativeElement.style.color = "";
      this.domSaldoMesAnterior.nativeElement.style.background = "";
    }
    if (campo === 'sm') {
      this.domSaldoMes.nativeElement.value = this.domSaldoMes.nativeElement.value.replace("-", "");
      this.domSaldoMes.nativeElement.style.color = "";
      this.domSaldoMes.nativeElement.style.background = "";
    }
  }

  checkNegativo(campo) {
    switch (campo) {
      case 'sma':
        if (this.domSaldoMesAnterior.nativeElement.value && this.domSaldoMesAnterior.nativeElement.value != "0,00") {
          if (this.domSaldoMesAnterior.nativeElement.value.indexOf("-") == -1) {
            this.setNegativo('sma');
          }
          else {
            this.setPositivo('sma');
          }
        }
        break;
      case 'sm':
        if (this.domSaldoMes.nativeElement.value && this.domSaldoMes.nativeElement.value != "0,00") {
          if (this.domSaldoMes.nativeElement.value.indexOf("-") == -1) {
            this.setNegativo('sm');
          }
          else {
            this.setPositivo('sm');
          }
        }
        break;
    }
    this.updateValues();
  }

  getFormatFromBuilder(v) {
    if (v) {
      v = this.getFormattedPrice(v);
      v = v.replace('R$', '').replace(/\s/, '');
    } else {
      if (v == 0) {
        v = '';
      }
    }
    return v;
  }

  getFormatFromView(v) {
    let isNegative: boolean;
    isNegative = false;
    if (v.indexOf("-") != -1) {
      isNegative = true;
    }
    v = v.replace("-", "")
      .replace(".", "")
      .replace(",", "")
      .replace(" ", "")
      .replace("*", "")
      .replace("(", "")
      .replace(")", "")
      .replace(";", "");
    v = this.getFormattedPrice(v / 100);
    v = v.replace("R$", "").trim();
    if (isNegative) {
      v = "-" + v;
    }
    return v;
  }



  fVal(campo, e) {
    let array = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (array.indexOf(e.key) != -1) {
      campo.value = this.getFormatFromView(campo.value);
    } else {
      campo.value = campo.value.replace(e.key, "");
    }
    if (e.key == "Backspace" || e.key == "Delete") {
      campo.value = this.getFormatFromView(campo.value);
    };
    this.updateValues();
  }

  getFormattedPrice(price: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  }


  writePreviousBalance() {

    this.isNewData();

    let contaId = this.formGroup.value.conta.id;
    let ano = this.formGroup.value.ano;
    let mes = this.formGroup.value.mes;


    if (mes == 1) {
      mes = 12;
      ano = ano - 1;
    } else {
      mes = mes - 1;
    }

    console.log(" conta=" + contaId, " ano=" + ano, " mes=" + mes);


    this.modelService.getSaldoByMonth(contaId, ano, mes)
      .subscribe(response => {
        if (response) {
          this.domSaldoMesAnterior.nativeElement.value = this.getFormatFromBuilder(response["saldoMes"].toString());
          this.domSaldoMesAnterior.nativeElement.disabled = true;
          this.domSinalSMA.nativeElement.style.visibility = 'hidden';
        } else {
          this.domSaldoMesAnterior.nativeElement.disabled = false;
          this.domSinalSMA.nativeElement.style.visibility = 'visible';
        }
      },
        error => {
          if (error.status == 403) {
          }
        });
  }

}
