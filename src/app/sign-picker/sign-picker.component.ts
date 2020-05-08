import { MapService, Sign } from './../map.service';
import { SignService } from './../sign.service';
import { Component, OnInit, ElementRef } from '@angular/core';
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
	// SignPicker only shows up when it is requested (e.g via a canvas click).
	hidden: boolean;


	constructor(
		private formBuilder: FormBuilder,
		private signService: SignService,
		private mapService: MapService
	) {
		mapService.emptyMapAreaClicked$.subscribe(data => {
			// We don't need the data (MapLocation) itself. Just use this to make ourselves visible.
			console.log("SignPicker: EmptyMapAreaclicked");
			this.hidden = false;
		})
		signService.signsUpdated$.subscribe(data => {
			this.signs = data;
			//console.log("Data in picker: " + JSON.stringify(this.signs));
		});
	}

	ngOnInit() {
		// Start off hidden
		this.hidden = true;

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

	isHidden() {
		console.log('IsHidden?' + this.hidden);
		return this.hidden;
	}

	onAddClick(signObj) {
		console.log("onAddClick(): " + JSON.stringify(signObj));
		let sign = new Sign;
		sign.signObj = signObj; //this.signs[id];
		this.mapService.addSign(sign);

		// We can now hide the signpicker
		this.hidden = true;
	}
}