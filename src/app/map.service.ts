import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// Sign object 
export class Sign {
  // Index of sign in the map's ordered list of signs.
  mapIndex: number;

  // As derived from signs.json
  signObj: Object;

  // Coordinates on map
  loc: MapLocation;

  // Rotation angle in degrees.
  rotation: number;

}

// A map can be clicked at a granular point or on a sign.
export class MapLocation {
  x: number;
  y: number;
  // Optional fields for storing the location relative to the canvas.
  canvasX?: number;
  canvasY?: number;
};

export enum MapAction {
  Add,  // Only makes sense at a point
  Edit,  // Only makes sense at a sign
  Delete,  // Only makes sense at a Sign
};

export class MapRequest {
  // Only filled when a click has been registered
  loc?: MapLocation;
  // Only filled when an action has been requested
  action?: MapAction;

  // Only makes sense for Delete or Edit actions
  oldSign?: Sign;

  // Only makes sense for Add or Edit actions
  newSign?: Sign;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  // Stores ongoing Maprequest state, if any
  request: MapRequest;

  // List of signs placed in Map
  mapSigns: Sign[];

  constructor() {
    this.mapSigns = [];
  }

  // This is observed by SignPicker to unhide itself.
  // TODO(harishrajamani): Also use this to trigger advanced options for action selection on canvas.
  private signPickerRequestedSource = new Subject<boolean>();
  signPickerRequested$ = this.signPickerRequestedSource.asObservable();

  // Gets the consolidated state of the map (list of ordered Signs with map location).
  getMapSigns() {
    return this.mapSigns;
  }

  // This is used to signal to the SignPicker that it should unhide itself.
  publishSignPickerRequest() {
    this.signPickerRequestedSource.next(true);
  }

  // The first instance of a request begins with a clicked location.
  registerClick(mapLocation: MapLocation, sign?: Sign) {
    this.request = new MapRequest;
    this.request.loc = mapLocation;
    // If the click was on a sign, then record that into the request state as oldSign.
    // This implies the action performed will be an Edit or a Delete on the oldSign.
    if (sign) {
      this.request.oldSign = sign;
    }
  }

  // At some point after first click, the user picks the Action at that sign/location.
  // This method registers the new Action into the existing request state, and
  // (a) in the case of Add/Edit, kicks off a request for the SignPicker component
  // (b) in the case of Delete, proceeds with deletion.
  registerAction(mapAction: MapAction) {
    try {
      this.request.action = mapAction;
      console.log("registerAction: " + JSON.stringify(this.request));
    } catch (error) {
      console.error("registerAction called before registerClick!");
    }
    // Deal with action
    switch (mapAction) {
      case MapAction.Add:
        // Publish sign picker request
        this.signPickerRequestedSource.next(true);
        break;
      case MapAction.Edit:
        // Publish sign picker request. Edit will have more steps
        // after SignPicker delegates control back.
        this.signPickerRequestedSource.next(true);
        break;
      case MapAction.Delete:
        // Delete the sign from mapSigns.
        this.mapSigns.splice(this.request.oldSign.mapIndex, 1);

        // This is the end of the delete request cycle.
        this.finishMapRequest();
        break;
    }

  }

  // This call is made by SignPicker after a sign has been picked. This can only happen in an Add/Edit scenario.
  // This method fills in all the remaining details for newSign (mapIndex, loc) and updates the state of the
  // mapSigns list.
  addPickedSign(newSign: Sign) {
    console.log("MapService.addPickedSign");

    // Add sign to model (maybe replacing old sign)
    if (this.request.action === MapAction.Edit) {
      // Clobber the old sign by putting it in the same index.
      newSign.mapIndex = this.request.oldSign.mapIndex;
      this.mapSigns[newSign.mapIndex] = newSign;
      // When a sign is clicked, the "clicked location" and rotation of the new sign should be
      // derived from the old sign.
      newSign.loc = this.request.oldSign.loc;
      newSign.rotation = this.request.oldSign.rotation;
    } else {  // MapAction.Add
      newSign.mapIndex = this.mapSigns.length;
      this.mapSigns.push(newSign);
      // When an empty canvas location is clicked, the raw coordinates of the click
      // are used to position the new sign.
      newSign.loc = this.request.loc;
    }

    // Update finalized MapRequest (just for console debug consistency).
    this.request.newSign = newSign;

    // This is the end of the add/edit request cycle.
    this.finishMapRequest();
  }

  swapSignPositions(i: number, j: number) {
    [i, j].forEach(val => {
      if (val < 0 || val >= this.mapSigns.length) {
        console.log("swapSignPositions received illegal inputs:" + i + "," + j);
        return;
      }
    });

    [this.mapSigns[i], this.mapSigns[j]] = [this.mapSigns[j], this.mapSigns[i]];
    // Now positions and orientations have changed. Recalibrate signs.
    this.recalibrateSigns();
  }

  recalibrateSigns() {
    let prevX = null;
    let prevY = null;
    this.mapSigns.forEach(function (sign, i) {
      // Recalibrate index
      sign.mapIndex = i;

      // Recalibrate angle (for all but the first sign).
      if (prevX && prevY) {
        let currX = sign.loc.canvasX;
        // Y negative because coordinate system has negative Y axis on canvas.
        let currY = -sign.loc.canvasY;

        // Angle in radians
        sign.rotation = Math.atan2(currY - prevY, currX - prevX);
        // Angle in degrees
        sign.rotation *= 180 / Math.PI;
        sign.rotation = 90 - sign.rotation;
      }
      prevX = sign.loc.canvasX;
      prevY = -sign.loc.canvasY;
    });
  }

  // Contains actions that should run at the end of a request cycle.
  finishMapRequest() {
    // Recalibrate signs since changes to this.mapSigns are now finalized.
    this.recalibrateSigns();

    // Just some logging
    console.log("Finalized MapRequest: " + JSON.stringify(this.request));
    console.log("Action:" + JSON.stringify(this.request.action));
    console.log("Loc" + JSON.stringify(this.request.loc));
    console.log("NewSign:" + JSON.stringify(this.request.newSign));
    console.log("OldSign:" + JSON.stringify(this.request.oldSign));
  
    // Delete request
    delete (this.request);

  }
}
