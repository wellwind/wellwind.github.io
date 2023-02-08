import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnslugifyPipe } from './unslugify.pipe';



@NgModule({
  declarations: [UnslugifyPipe],
  exports: [UnslugifyPipe],
  imports: [
    CommonModule
  ]
})
export class UnslugifyModule { }
