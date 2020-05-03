import { SignsService } from './../signs.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
	selector: 'sign-picker',
	templateUrl: 'sign-picker.component.html'
})

export class SignPickerComponent implements OnInit {
	signs;
	query: "";
	searchForm;

	constructor(
		private signsService: SignsService,
		private formBuilder: FormBuilder
	) {}

	ngOnInit() {
		this.signs = this.signsService.getSigns();
		this.searchForm = this.formBuilder.group({
			query: ''
		});
		this.searchForm.get('query').valueChanges.forEach(value => {
			this.query = value;
			this.signs = this.signsService.searchSigns(this.query);
			//console.log("Data in picker: " + JSON.stringify(this.signs));
		});
	}
}