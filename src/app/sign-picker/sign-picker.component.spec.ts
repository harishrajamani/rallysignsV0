import { TestBed, inject } from '@angular/core/testing';

import { SignPickerComponent } from './sign-picker.component';

describe('a sign-picker component', () => {
	let component: SignPickerComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				SignPickerComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([SignPickerComponent], (SignPickerComponent) => {
		component = SignPickerComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});