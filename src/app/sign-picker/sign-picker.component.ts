import { MapService, Sign } from './../map.service';
import { SignService } from './../sign.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
	selector: 'sign-picker',
	templateUrl: 'sign-picker.component.html',
	providers: [SignService]
})

export class SignPickerComponent implements OnInit {
	signs;
	query: "";
	searchForm;

	constructor(
		private formBuilder: FormBuilder,
		private signService: SignService,
		private mapService: MapService
	) {
		signService.signsUpdated$.subscribe(data => {
			this.signs = data;
			//console.log("Data in picker: " + JSON.stringify(this.signs));
		})
	}

	ngOnInit() {
		// Start off with a view of all signs.
		this.signService.updateSigns('');

		this.searchForm = this.formBuilder.group({
			query: ''
		});
		this.searchForm.get('query').valueChanges.forEach(value => {
			this.query = value;
			this.signService.updateSigns(value);
		});
	}

	onAddClick(signObj) {
		console.log("onAddClick(): " + JSON.stringify(signObj));
		let sign = new Sign;
		sign.signObj = signObj; //this.signs[id];
		this.mapService.addSign(sign);
	}
}