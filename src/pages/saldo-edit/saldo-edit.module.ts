import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaldoEditPage } from './saldo-edit';

import { IonMaskModule } from '@pluritech/ion-mask';
import { IonCurrencyMaskModule } from '@pluritech/ion-currencymask';


@NgModule({
  declarations: [
    SaldoEditPage
  ],
  imports: [
    IonicPageModule.forChild(SaldoEditPage),
    IonMaskModule.forRoot(),
    IonCurrencyMaskModule
  ],
})
export class SaldoEditPageModule {}
