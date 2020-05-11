import { Component } from '@angular/core';
import { MapService } from './map.service';
import { SignService } from './sign.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [SignService, MapService]

})
export class AppComponent {
  title = 'rallymap';
}
