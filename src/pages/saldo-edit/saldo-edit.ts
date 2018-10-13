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

  @ViewChild('inputSomaReceitasCorrentes') domInputSomaReceitasCorrentes: ElementRef;
  @ViewChild('inputSomaReceitasExtras') domInputSomaReceitasExtras: ElementRef;
  @ViewChild('inputSomaGastosExtras') domInputSomaGastosExtras: ElementRef;
  @ViewChild('inputSomaInvestimentos') domInputSomaInvestimentos: ElementRef;

  @ViewChild('trashSomaReceitasCorrentes') domTrashSomaReceitasCorrentes: ElementRef;
  @ViewChild('trashSomaReceitasExtras') domTrashSomaReceitasExtras: ElementRef;
  @ViewChild('trashSomaGastosExtras') domTrashSomaGastosExtras: ElementRef;
  @ViewChild('trashSomaInvestimentos') domTrashSomaInvestimentos: ElementRef;

  @ViewChild('adSomaReceitasCorrentes') domAdSomaReceitasCorrentes: ElementRef;
  @ViewChild('ipSomaReceitasCorrentes') domIpSomaReceitasCorrentes: ElementRef;

  @ViewChild('adSomaReceitasExtras') domAdSomaReceitasExtras: ElementRef;
  @ViewChild('ipSomaReceitasExtras') domIpSomaReceitasExtras: ElementRef;

  @ViewChild('adSomaGastosExtras') domAdSomaGastosExtras: ElementRef;
  @ViewChild('ipSomaGastosExtras') domIpSomaGastosExtras: ElementRef;

  @ViewChild('adSomaInvestimentos') domAdSomaInvestimentos: ElementRef;
  @ViewChild('ipSomaInvestimentos') domIpSomaInvestimentos: ElementRef;


  model: SaldoDTO;
  formGroup: FormGroup;
  lblButton = "";
  disabledMes = false;
  inconsistentValue = false;


  arrayAnos: String[] = [];
  data = new Date();
  ano = this.data.getFullYear();
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

    if (gastosCorrentes < 0) {
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
      this.domSinalSMA.nativeElement.innerHTML = 'D';
      this.domSinalSMA.nativeElement.style.color = 'red';
    }
    if (campo === 'sm') {
      this.domSaldoMes.nativeElement.value = "-" + this.domSaldoMes.nativeElement.value.toString().replace("-", "");
      this.domSaldoMes.nativeElement.style.color = "red";
      this.domSaldoMes.nativeElement.style.background = "rgba(253, 1, 1, 0.062)";
      this.domSinalSM.nativeElement.innerHTML = 'D';
      this.domSinalSM.nativeElement.style.color = 'red';
    }
  }

  setPositivo(campo) {
    if (campo === 'sma') {
      this.domSaldoMesAnterior.nativeElement.value = this.domSaldoMesAnterior.nativeElement.value.replace("-", "");
      this.domSaldoMesAnterior.nativeElement.style.color = "";
      this.domSaldoMesAnterior.nativeElement.style.background = "";
      this.domSinalSMA.nativeElement.innerHTML = 'C';
      this.domSinalSMA.nativeElement.style.color = '';
    }
    if (campo === 'sm') {
      this.domSaldoMes.nativeElement.value = this.domSaldoMes.nativeElement.value.replace("-", "");
      this.domSaldoMes.nativeElement.style.color = "";
      this.domSaldoMes.nativeElement.style.background = "";
      this.domSinalSM.nativeElement.innerHTML = 'C';
      this.domSinalSM.nativeElement.style.color = '';
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

  getFormatFromBuilder(valorCampo) {
    
    
    if (!valorCampo) {
      valorCampo = 0;
    } else {
      if (valorCampo.toString().indexOf(".")==-1) {
        valorCampo = parseInt(valorCampo) * 100;
      }
    }

    for (let i = 0; i < valorCampo.length; i++) {
      if (valorCampo[i] == '.' || valorCampo[i] == ',') {
        valorCampo = valorCampo.replace(valorCampo[i], '');
      };
    }

    valorCampo = parseInt(valorCampo).toString();

    if (valorCampo.length < 3) {
      if (valorCampo.length == 1) {
        valorCampo = parseInt(valorCampo);
        valorCampo = "00" + valorCampo.toString();
      }
      if (valorCampo.length == 2) {
        valorCampo = parseInt(valorCampo);
        valorCampo = "0" + valorCampo.toString();
      }
    }


    valorCampo = valorCampo.split('').reverse().join('');

    let valorCampoFormatado = '';
    for (let i = 0; i < valorCampo.length; i++) {
      valorCampoFormatado = valorCampoFormatado + valorCampo[i];
      if (i == 1) {
        valorCampoFormatado = valorCampoFormatado + ',';
      };
      if ((i == 4 || i == 7 || i == 10 ) && ((i + 1) != valorCampo.length)) {
        valorCampoFormatado = valorCampoFormatado + '.';
      };
    }

    valorCampo = valorCampoFormatado.split('').reverse().join('');

    return valorCampo;

    }


  f (campo, e) {

    let valorCampo = campo.value;
   
    const arrayNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (arrayNumbers.indexOf(e.key)==-1) {
      valorCampo = valorCampo.replace(e.key,'');
    }
    
    if (!valorCampo) {
      valorCampo = 0;
    }

    for (let i = 0; i < valorCampo.length; i++) {
      if (valorCampo[i] == '.' || valorCampo[i] == ',') {
        valorCampo = valorCampo.replace(valorCampo[i], '');
      };
    }

    valorCampo = parseInt(valorCampo).toString();

    if (valorCampo.length < 3) {
      if (valorCampo.length == 1) {
        valorCampo = parseInt(valorCampo);
        valorCampo = "00" + valorCampo.toString();
      }
      if (valorCampo.length == 2) {
        valorCampo = parseInt(valorCampo);
        valorCampo = "0" + valorCampo.toString();
      }
    }


    valorCampo = valorCampo.split('').reverse().join('');

    campo.value = '';

    let valorCampoFormatado = '';
    for (let i = 0; i < valorCampo.length; i++) {
      valorCampoFormatado = valorCampoFormatado + valorCampo[i];
      if (i == 1) {
        valorCampoFormatado = valorCampoFormatado + ',';
      };
      if ((i == 4 || i == 7 || i == 10 ) && ((i + 1) != valorCampo.length)) {
        valorCampoFormatado = valorCampoFormatado + '.';
      };
    }

    valorCampo = valorCampoFormatado.split('').reverse().join('');

    campo.value = valorCampo;

    this.updateValues();
  }


  writePreviousBalance() {

    this.domTrashSomaReceitasCorrentes.nativeElement.style.visibility = 'hidden';
    this.domTrashSomaReceitasExtras.nativeElement.style.visibility = 'hidden';
    this.domTrashSomaGastosExtras.nativeElement.style.visibility = 'hidden';
    this.domTrashSomaInvestimentos.nativeElement.style.visibility = 'hidden';

    this.domIpSomaReceitasCorrentes.nativeElement.style.visibility = 'hidden';
    this.domIpSomaReceitasExtras.nativeElement.style.visibility = 'hidden';
    this.domIpSomaGastosExtras.nativeElement.style.visibility = 'hidden';
    this.domIpSomaInvestimentos.nativeElement.style.visibility = 'hidden';


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

    this.updateValues();
    console.log("foi");
  }

  adValor(ad, ip) {
    if (ip.nativeElement.style.visibility != "visible") {
      ip.nativeElement.style.visibility = "visible";
      ad.nativeElement.innerHTML = "cancelar";
    } else {
      ip.nativeElement.style.visibility = "hidden";
      ad.nativeElement.innerHTML = "somar";
    }
  }


  somaValor(componente, input, btn, ad, ip) {
    let val = componente.nativeElement.value;
    if (input.nativeElement.value) {
      if (val) {
        val = val.replace(".", "").replace(",", ".");
        val = parseFloat(val);
        input.nativeElement.value = input.nativeElement.value.replace(".", "").replace(",", ".")
        componente.nativeElement.value = (val + parseFloat(input.nativeElement.value)) * 100;
        componente.nativeElement.value = this.fVal(componente.nativeElement.value);
      } else {
        componente.nativeElement.value = input.nativeElement.value.replace(".", "").replace(",", ".");
        componente.nativeElement.value = this.fVal(componente.nativeElement.value);
      }
      btn.nativeElement.style.visibility = 'visible';
      ad.nativeElement.innerHTML = 'somar';
      ip.nativeElement.style.visibility = 'hidden';
      input.nativeElement.value = null;

      this.updateValues();
    }
  }

  apagar(campo, btn) {
    campo.nativeElement.value = null;
    btn.nativeElement.style.visibility = 'hidden';
    this.updateValues();
  }

  cancel() {
    this.navCtrl.pop();
  }

}
