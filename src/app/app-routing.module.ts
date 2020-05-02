import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapMakerComponent } from './map-maker/map-maker.component';


const routes: Routes = [
  {path: "", component: MapMakerComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
