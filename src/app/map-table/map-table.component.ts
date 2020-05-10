import { Sign, MapService } from './../map.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';

export interface TableSign {
  position: number;
  id: number;
  name: "";
}

@Component({
  selector: 'app-map-table',
  templateUrl: './map-table.component.html',
  styleUrls: ['./map-table.component.scss']
})
export class MapTableComponent implements OnInit {
  // Map signs. This is only a reflected property of MapService.getMapSigns().
  // Meaning, MapAreaComponent doesn't maintain map state, it always gets it fresh
  // from MapService (during ngOnInit()).
  signs: Sign[];

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.signs = this.mapService.getMapSigns();
  }

}
