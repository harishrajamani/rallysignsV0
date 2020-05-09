import { Sign } from './../map.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-map-sign',
  templateUrl: './map-sign.component.html',
  styleUrls: ['./map-sign.component.scss']
})
export class MapSignComponent implements OnInit {

  @Input() sign: Sign;

  @Output() clickedSign = new EventEmitter<Sign>();

  @ViewChild('mySignDiv', {static: true})
  mySignDiv: ElementRef<HTMLDivElement>;

  constructor() { }

  ngOnInit(): void {
  }

  // Returns the mapIndex of this sign.
  getId() {
    return this.sign.mapIndex;
  }

  // Returns the X-coordinate (style.left.px) for the sign div.
  getX() {
    return this.sign.loc.x;
  }

  // Returns the Y-coordinate (style.top.px) for the sign div.
  getY() {
    return this.sign.loc.y;
  }

  // Returns the image to be displayed in the sign div.
  getImg() {
    return this.sign.signObj["image"]["small"];
  }

  getWidth() {
    return
  }

  onClick() {
    console.log("Sign clicked: " + JSON.stringify(this.sign));
    this.clickedSign.emit(this.sign);
  }
}
