import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SecretSantaComponent } from './secret-santa.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: SecretSantaComponent },
    ]),
  ]
})
export class SecretSantaModule { }
