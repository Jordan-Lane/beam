import { Vector3 } from "three";
import { InsertableObject3D } from "../types";

class InsertionController {
  private _attachedObject: InsertableObject3D | undefined;
  private _insertionPoint: Vector3;

  constructor() {
    this._insertionPoint = new Vector3(0, 0);
  }

  get object() {
    return this._attachedObject;
  }

  attach(object: InsertableObject3D) {
    if (this._attachedObject === object) {
      return;
    }

    this._insertionPoint.copy(object.position);

    this._attachedObject = object;
    this._attachedObject.inserting = true;

    if (this._attachedObject.onAttach) {
      this._attachedObject.onAttach();
    }
  }

  detach() {
    if (this._attachedObject) {
      this._attachedObject.inserting = false;
    }

    if (this._attachedObject?.onDetach) {
      this._attachedObject.onDetach();
    }

    this._attachedObject = undefined;
  }

  get insertionPoint(): Vector3 {
    return this._insertionPoint;
  }

  set insertionPoint(point: Vector3) {
    if (this._insertionPoint.equals(point)) {
      return;
    }

    this._insertionPoint = point;

    if (this._attachedObject && this._attachedObject.onInsertionUpdate) {
      this._attachedObject.onInsertionUpdate(this);
    }
  }
}

export default InsertionController;
