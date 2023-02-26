import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnslugifyPipe } from './unslugify.pipe';



@NgModule({
    exports: [UnslugifyPipe],
    imports: [
        CommonModule,
        UnslugifyPipe
    ]
})
export class UnslugifyModule { }
