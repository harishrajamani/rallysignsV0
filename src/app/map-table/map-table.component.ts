import { Sign } from './../map.service';
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
  @Input() signs: Sign[];

  //@ViewChild('table') table: MatTable<TableSign>;

  constructor() { }

  ngOnInit(): void {
  }

}
