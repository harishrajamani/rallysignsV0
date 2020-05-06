import { SignPickerComponent } from './sign-picker/sign-picker.component';
import { MapMakerComponent } from './map-maker/map-maker.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MapAreaComponent } from './map-area/map-area.component';

@NgModule({
  declarations: [
    AppComponent,
    MapMakerComponent,
    SignPickerComponent,
    MapAreaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
