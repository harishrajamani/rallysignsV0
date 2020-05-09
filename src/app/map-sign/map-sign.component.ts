import { MapRequest } from './../map.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-map-sign',
  templateUrl: './map-sign.component.html',
  styleUrls: ['./map-sign.component.scss']
})
export class MapSignComponent implements OnInit {

  @Input() mapRequest: MapRequest;

  constructor() { }

  ngOnInit(): void {
  }

  getImg() {
    return this.mapRequest.newSign.signObj["image"]["small"];
  }

}
