import { PushModule } from '@rx-angular/template/push';
import { LikerCoinComponent } from './liker-coin.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    exports: [LikerCoinComponent],
    imports: [
        CommonModule, PushModule,
        LikerCoinComponent
    ]
})
export class LikerCoinModule { }
