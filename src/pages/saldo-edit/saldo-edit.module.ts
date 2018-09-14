import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaldoEditPage } from './saldo-edit';

@NgModule({
  declarations: [
    SaldoEditPage,
  ],
  imports: [
    IonicPageModule.forChild(SaldoEditPage),
  ],
})
export class SaldoEditPageModule {}
