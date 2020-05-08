import { SignService } from './../sign.service';
import { MapService, MapRequest, Sign, MapAction } from './../map.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-map-area',
  templateUrl: './map-area.component.html',
  styleUrls: ['./map-area.component.scss']
})
export class MapAreaComponent implements OnInit {
  // TODO(harishr): @ViewChild('canvas', {static: false}) canvas: ElementRef;?

  @ViewChild('myCanvas', { static: true })
  myCanvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('myActionGroup', { static: true })
  myActionGroup: ElementRef<HTMLDivElement>;

  private ctx: CanvasRenderingContext2D;

  actionButtonHidden: Map<MapAction, boolean> = new Map;



  constructor(
    private mapService: MapService,
    private signService: SignService) {

    mapService.mapUpdated$.subscribe(data => {
      // TODO(harishr): If oldsign exists then clear.
      let mapRequest = data as MapRequest;
      console.log("New update in map-area: " + JSON.stringify(mapRequest));
      this.drawSign(mapRequest.newSign, mapRequest.loc.x, mapRequest.loc.y);
      //mapRequest.newSign.draw(this.ctx, mapRequest.loc.x, mapRequest.loc.y);
    });
  }

  // TODO(harishr): ngAfterViewInit?
  ngOnInit(): void {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    this.actionButtonHidden.set(MapAction.Add, true);
    this.actionButtonHidden.set(MapAction.Edit, true);
    this.actionButtonHidden.set(MapAction.Delete, true);
    console.log("this.ActionButtonHidden: ", this.actionButtonHidden);
  }

  onCanvasClick(event) {
    var x = event.x;
    var y = event.y;
    var offsetX = event.offsetX;
    var offsetY = event.offsetY;
    console.log("onCanvasClick: " + x + "," + y + "," + offsetX + "," + offsetY);

    this.displayActionButtonGroup(event.x, event.y, [ MapAction.Add ]);



    this.mapService.registerAction(MapAction.Add, offsetX, offsetY);

    // Enable signpicker
    // TODO(harishr): When a second state is added for picking action on canvas, move this there.
    this.mapService.publishEmptyMapAreaClick(offsetX, offsetY);
  }

  displayActionButtonGroup(x: number, y: number, actions: MapAction[]) {
    actions.forEach(action => {
      this.actionButtonHidden.set(action, false);
    });
    // Display action group for selection
    this.myActionGroup.nativeElement.style.position = "absolute";
    this.myActionGroup.nativeElement.style.left = x + 'px';
    this.myActionGroup.nativeElement.style.top = y + 'px';
  }

  drawSign(sign: Sign, x: number, y: number) {
    var img = new Image;
    let ctx = this.ctx;
    img.onload = function () {
      ctx.drawImage(img, x, y, img.width * 0.25, img.height * 0.25); // Or at whatever offset you like
    };
    img.src = sign.signObj["image"]["small"];
  }

  addButtonHidden() {
    return this.actionButtonHidden.get(MapAction.Add);
  }

  editButtonHidden() {
    return this.actionButtonHidden.get(MapAction.Edit);
  }

  deleteButtonHidden() {
    return this.actionButtonHidden.get(MapAction.Delete);
  }


}
