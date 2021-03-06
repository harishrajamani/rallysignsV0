import { SignService } from './../sign.service';
import { MapService, MapRequest, Sign, MapAction, MapLocation } from './../map.service';
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ActivationStart, Router } from '@angular/router';
import { MapSignComponent } from '../map-sign/map-sign.component';

@Component({
  selector: 'app-map-area',
  templateUrl: './map-area.component.html',
  styleUrls: ['./map-area.component.scss']
})
export class MapAreaComponent implements OnInit, AfterViewInit {
  // A canvas for letting the user issue click actions.
  @ViewChild('myCanvas', { static: true })
  myCanvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  // ButtonGroup menu for selecting Add, Edit or Delete action on a map location (coordinates or sign div).
  @ViewChild('myActionGroup', { static: true })
  myActionGroup: ElementRef<HTMLDivElement>;

  // View of template children of type MapSignComponent.
  @ViewChildren('myMapSigns')
  myMapSigns: QueryList<MapSignComponent>;

  // Whether or not a given Action button (e.g Add) in the Action group should be hidden.
  actionButtonHidden: Map<MapAction, boolean> = new Map;

  // Map sign
  mapRequest: MapRequest;

  // Map signs. This is only a reflected property of MapService.getMapSigns().
  // Meaning, MapAreaComponent doesn't maintain map state, it always gets it fresh
  // from MapService (during ngOnInit()).
  signs: Sign[];

  constructor(
    private mapService: MapService,
    private signService: SignService,
    private router: Router) {
  }

  // TODO(harishr): ngAfterViewInit?
  ngOnInit(): void {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    // Start without any Action menus.
    this.hideActionButtonGroup();
    // Refresh state of all the map signs
    this.signs = this.mapService.getMapSigns();
  }

  ngAfterViewInit(): void {
    // When we add a sign, we need to redraw.
    // TODO(harishrajamani): Why does this not cause a change to myMapSigns?
    this.redrawLines();
  
    // When we delete or reorder signs, we need to redraw.
    this.myMapSigns.changes.subscribe(data => {
      this.redrawLines();
    });
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

    // Register click event with MapService.
    this.mapService.registerClick({ x: pageX, y: pageY, canvasX: offsetX, canvasY: offsetY });
    this.displayActionButtonGroup(pageX, pageY, [MapAction.Add]);
  }

  // Redraws lines between signs in order.
  // If provided, the canvasX, canvasY coordinates indicate a new final position where a sign has not yet been placed.
  redrawLines(canvasX?: number, canvasY?: number) {
    // Clear canvas.
    this.ctx.clearRect(0, 0, this.myCanvas.nativeElement.width, this.myCanvas.nativeElement.height);
    this.ctx.beginPath();
    for (const [i, sign] of this.signs.entries()) {
      // When drawing lines, use the centre of the sign as the reference point.
      let x = sign.loc.canvasX + this.getMapSignWidth() / 2;
      let y = sign.loc.canvasY + this.getMapSignHeight() / 2;
      if (i==0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
      }
    };
    if (canvasX && canvasY && this.signs.length > 0) {
      // Finally, draw a line to the latest canvas coordinates (this sign hasn't been added yet).
      this.ctx.lineTo(canvasX, canvasY);
      this.ctx.stroke();
    }
  }

  // What to do when a coordinate location and an Add action have been registered from the user.
  onAddButtonClick() {
    // Register the Add action into the MapService's request state.
    // The cascading actions (e.g requesting SignPicker, adding the new Sign) will be handled by MapService.
    this.mapService.registerAction(MapAction.Add);
    // The button group's job is done.
    this.hideActionButtonGroup();

    // Navigate to signpicker by router link.
    this.router.navigateByUrl('/signspicker');
  }

  // What to do when a sign location and an Edit action have been registered from the user.
  onEditButtonClick() {
    // Register the Edit action into the MapService's request state.
    // The cascading actions (e.g requesting SignPicker, replacing current with new Sign) will be handled by MapService.
    this.mapService.registerAction(MapAction.Edit);
    // The button group's job is done.
    this.hideActionButtonGroup();

    // TODO(als83): Add a router link here
    this.router.navigateByUrl('/signspicker');
  }

  // What to do when a sign location and a Delete action have been registered from the user.
  onDeleteButtonClick() {
    // Register the Delete action into the MapService's request state.
    // The cascading actions (deleting the current Sign) will be handled by MapService.
    this.mapService.registerAction(MapAction.Delete);
    // The button group's job is done.
    this.hideActionButtonGroup();
  }

  getMapSignWidth() {
    if (this.myMapSigns.length == 0) {
      console.log('this.myMapSigns' + JSON.stringify(this.myMapSigns));
      return null;
    }
    return this.myMapSigns.first.mySignDiv.nativeElement.offsetWidth;
  }

  getMapSignHeight() {
    if (this.myMapSigns.length == 0) {
      return null;
    }
    return this.myMapSigns.first.mySignDiv.nativeElement.offsetHeight;
  }

  onSignClick(event) {
    let sign = (event as Sign);
    // Register click event with MapService.
    this.mapService.registerClick({ x: sign.loc.x, y: sign.loc.y }, sign);
    this.displayActionButtonGroup(sign.loc.x + this.getMapSignWidth(), sign.loc.y + this.getMapSignHeight(), [MapAction.Edit, MapAction.Delete]);
  }

  // Method for displaying (i.e unhiding) a subset of enabled actions on myActionGroup at a given position.
  displayActionButtonGroup(x: number, y: number, actions: MapAction[]) {
    // First clear all currently enabled actions. Otherwise multiple clicks can stack up state changes unpredictably.
    this.hideActionButtonGroup();

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
