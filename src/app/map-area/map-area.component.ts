import { MapService, MapRequest, Sign, MapAction } from './../map.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-map-area',
  templateUrl: './map-area.component.html',
  styleUrls: ['./map-area.component.scss']
})
export class MapAreaComponent implements OnInit {
  // TODO(harishr): @ViewChild('canvas', {static: false}) canvas: ElementRef;?

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  constructor(private mapService: MapService) {
    mapService.mapUpdated$.subscribe(data => {
      // TODO(harishr): If oldsign exists then clear.
      let mapRequest = data as MapRequest;
      console.log("New update in map-area: " + JSON.stringify(mapRequest));
      this.drawSign(mapRequest.newSign, mapRequest.loc.x, mapRequest.loc.y);
      //mapRequest.newSign.draw(this.ctx, mapRequest.loc.x, mapRequest.loc.y);
    });
  }

  onCanvasClick(event) {
    var x = event.x;
    var y = event.y;
    var offsetX = event.offsetX;
    var offsetY = event.offsetY;
    console.log("onCanvasClick: " + x + "," + y + "," + offsetX + "," + offsetY);
    this.mapService.registerAction(MapAction.Add, offsetX, offsetY);
  }

  drawSign(sign: Sign, x: number, y: number) {
    var img = new Image;
    let ctx = this.ctx;
    img.onload = function () {
      ctx.drawImage(img, x, y, 80, 80); // Or at whatever offset you like
    };
    img.src = sign.signObj["image"]["small"];
  }

  // TODO(harishr): ngAfterViewInit?
  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

}
