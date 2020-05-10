import { SignPickerComponent } from './sign-picker/sign-picker.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapMakerComponent } from './map-maker/map-maker.component';


const routes: Routes = [
  {path: "", component: MapMakerComponent},
  {path: "signpicker", component: SignPickerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
