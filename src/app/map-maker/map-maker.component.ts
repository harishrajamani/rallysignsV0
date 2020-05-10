import { MapService } from './../map.service';
import { SignService } from './../sign.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'map-maker',
	templateUrl: 'map-maker.component.html',
	providers: [SignService, MapService]
})

export class MapMakerComponent implements OnInit {
	ngOnInit() { }
}