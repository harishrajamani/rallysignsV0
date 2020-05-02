import { TestBed, inject } from '@angular/core/testing';

import { MapMakerComponent } from './map-maker.component';

describe('a map-maker component', () => {
	let component: MapMakerComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				MapMakerComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([MapMakerComponent], (MapMakerComponent) => {
		component = MapMakerComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});