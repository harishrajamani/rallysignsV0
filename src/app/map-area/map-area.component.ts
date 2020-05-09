import { SignService } from './../sign.service';
import { MapService, MapRequest, Sign, MapAction, MapLocation } from './../map.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivationStart } from '@angular/router';

@Component({
  selector: 'app-map-area',
  templateUrl: './map-area.component.html',
  styleUrls: ['./map-area.component.scss']
})
export class MapAreaComponent implements OnInit {
  // TODO(harishr): @ViewChild('canvas', {static: false}) canvas: ElementRef;?

  // A canvas for letting the user issue click actions.
  @ViewChild('myCanvas', { static: true })
  myCanvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  // ContextMenu for selecting Add, Edit or Delete action on a map location (coordinates or sign div).
  @ViewChild('myActionGroup', { static: true })
  myActionGroup: ElementRef<HTMLDivElement>;

  // Whether or not a given Action button (e.g Add) in the Action group should be hidden.
  actionButtonHidden: Map<MapAction, boolean> = new Map;

  // Map sign
  mapRequest: MapRequest;

  constructor(
    private mapService: MapService,
    private signService: SignService) {
    // MapArea seubscribes to the mapUpdated signal from MapService, so it can render the new sign.
    mapService.mapUpdated$.subscribe(data => {
      // TODO(harishr): If oldsign exists then clear.
      let mapRequest = data as MapRequest;
      console.log("New update in map-area: " + JSON.stringify(mapRequest));
      //this.drawSign(mapRequest.newSign, mapRequest.loc.x, mapRequest.loc.y);

      // Div based sign
      this.mapRequest = mapRequest;
    });
  }

  // TODO(harishr): ngAfterViewInit?
  ngOnInit(): void {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    // Start without any Action menus.
    this.hideActionButtonGroup();
  }

  // When the canvas is clicked, we register a new map request at the clicked location.
  // This will prompt user interactions with myActionGroup that determine the action and potential sign updates
  // to be incorporated.
  onCanvasClick(event) {
    var x = event.x;
    var y = event.y;
    var offsetX = event.offsetX;
    var offsetY = event.offsetY;
    var pageX = event.pageX;
    var pageY = event.pageY;
    console.log("onCanvasClick: " + x + "," + y + "," + offsetX + "," + offsetY + "," + pageX + "," + pageY);

    // TODO(harishr): might need to change this to x, y instead of offsetX, offsetY
    // when using divs.
    this.mapService.registerClick({ x: pageX, y: pageY });
    this.displayActionButtonGroup(pageX, pageY, [ MapAction.Add ]);
  }

  // What to do when a coordinate location and an Add action have been registered from the user.
  onAddButtonClick() {
    // Register the Add action into the MapService's request state.
    // The cascading actions (e.g requesting SignPicker, adding the new Sign) will be handled by MapService.
    this.mapService.registerAction(MapAction.Add);
    // The button group's job is done.
    this.hideActionButtonGroup();
  }

  // What to do when a sign location and an Edit action have been registered from the user.
  onEditButtonClick() {
    // Register the Edit action into the MapService's request state.
    // The cascading actions (e.g requesting SignPicker, replacing current with new Sign) will be handled by MapService.
    this.mapService.registerAction(MapAction.Edit);
    // The button group's job is done.
    this.hideActionButtonGroup();
  }

  // What to do when a sign location and a Delete action have been registered from the user.
  onDeleteButtonClick() {
    // Register the Delete action into the MapService's request state.
    // The cascading actions (deleting the current Sign) will be handled by MapService.
    this.mapService.registerAction(MapAction.Delete);
    // The button group's job is done.
    this.hideActionButtonGroup();
  }

  // Method for displaying (i.e unhiding) a subset of enabled actions on myActionGroup at a given position.
  displayActionButtonGroup(x: number, y: number, actions: MapAction[]) {
    actions.forEach(action => {
      this.actionButtonHidden.set(action, false);
    });
    // Display action group for selection
    this.myActionGroup.nativeElement.style.position = "absolute";
    this.myActionGroup.nativeElement.style.left = x + 'px';
    this.myActionGroup.nativeElement.style.top = y + 'px';
  }

  // Method for hiding the entire myActionGroup.
  hideActionButtonGroup() {
    this.actionButtonHidden.set(MapAction.Add, true);
    this.actionButtonHidden.set(MapAction.Edit, true);
    this.actionButtonHidden.set(MapAction.Delete, true);
  }

  // Draw a confirmed sign at a specific location on the canvas.
  drawSign(sign: Sign, x: number, y: number) {
    var img = new Image;
    let ctx = this.ctx;
    img.onload = function () {
      ctx.drawImage(img, x, y, img.width * 0.25, img.height * 0.25); // Or at whatever offset you like
    };
    img.src = sign.signObj["image"]["small"];
  }

  // State of Add action button for template
  addButtonHidden() {
    return this.actionButtonHidden.get(MapAction.Add);
  }

  // State of Edit action button for template
  editButtonHidden() {
    return this.actionButtonHidden.get(MapAction.Edit);
  }

  // State of Delete action button for template
  deleteButtonHidden() {
    return this.actionButtonHidden.get(MapAction.Delete);
  }


}
