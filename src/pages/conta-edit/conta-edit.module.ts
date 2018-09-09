import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContaEditPage } from './conta-edit';

@NgModule({
  declarations: [
    ContaEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ContaEditPage),
  ],
})
export class ContaEditPageModule {}
