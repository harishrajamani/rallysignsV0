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
  
}

// A map can be clicked at a granular point or on a sign.
export class MapLocation {
  x: number;
  y: number;
};
// interface MapLocationWithSign {
//   // TODO(harishr): This doesn't solve the problem of how to pass in x, y for old sign.
//   signId: number;
// };
//type MapLocation = MapLocationWithPoint; // | MapLocationWithSign;

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

  isValid() {
    // Location and action must exist
    if (!this.loc || !this.action) {
      return false;
    }
    // For newSign requests...
    if (this.newSign) {
      // Action cannot be Delete
      if (this.action === MapAction.Delete) {
        return false;
      }
      // TODO(harishrajamani): Add more validation rules
      // E.g If location is Sign, Action cannot be Add
    }
    return true;
  }
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

  // TODO(harishr): Remove this.
  // This was originally created to signal to MapAreaComponent to refresh signs but is no longer needed.
  // private mapUpdatedSource = new Subject<MapRequest>();
  // mapUpdated$ = this.mapUpdatedSource.asObservable();

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
    console.log("registerAction");
    try {
      this.request.action = mapAction;
      console.log("registerAction: " + JSON.stringify(this.request));
    } catch (error) {
      console.error("registerAction called before registerClick!");
    }
    // Deal with action
    switch(mapAction) {
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
        // TODO(harishr): Delete sign
        this.mapSigns.splice(this.request.oldSign.mapIndex, 1);
        break;
    }
  }

  // This call is made by SignPicker after a sign has been picked. This can only happen in an Add/Edit scenario.
  // This method fills in all the remaining details for newSign (mapIndex, loc) and updates the state of the
  // mapSigns list.
  addPickedSign(newSign: Sign) {
    console.log("MapService.addPickedSign");
    //if (!this.request.isValid()) {
    //  throw new Error("Invalid MapRequest: " + JSON.stringify(this.request));
    //}

    // Add sign to model (maybe replacing old sign)
    if (this.request.action === MapAction.Edit) {
      // Clobber the old sign by putting it in the same index.
      newSign.mapIndex = this.request.oldSign.mapIndex;
      this.mapSigns[newSign.mapIndex] = newSign;
      // When a sign is clicked, the "clicked location" of the new sign should be
      // the position of the old sign itself. 
      newSign.loc = this.request.loc;
    } else {  // MapAction.Add
      newSign.mapIndex = this.mapSigns.length;
      this.mapSigns.push(newSign);
      // When an empty canvas location is clicked, the raw coordinates of the click
      // are used to position the new sign.
      newSign.loc = this.request.loc;
    }
    // Update finalized MapRequest and log to console (just for debug).
    this.request.newSign = newSign;
    console.log("Finalized MapRequest: " + JSON.stringify(this.request));

    // No need to update this stream anymore.
    //this.mapUpdatedSource.next(this.request);
  
    // Clear MapRequest
    delete(this.request);
  }
}
