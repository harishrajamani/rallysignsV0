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
		private signService: SignService
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
}