import { Intersection, Object3D, Event, Color, Mesh } from "three";
import InsertionController from "./controllers/InsertionController";
import { CSS3DObject } from "three-stdlib";

export interface ThreePointerMoveEvent extends Event {
  pointermove: ThreePointerEventData;
}

export interface ThreePointerDownEvent extends Event {
  pointerdown: ThreePointerEventData;
}

export interface ThreePointerEventData {
  type: string;
  hit: Intersection<Object3D>;
}

export interface Insertable {
  inserting: boolean;
  onInsertionClick?: (
    insertionController: InsertionController,
    pointerEvent: ThreePointerDownEvent
  ) => void;
  onInsertionUpdate?: (insertionController: InsertionController) => void;
  onAttach?: () => void;
  onDetach?: () => void;
}

export interface Batchable {
  batchInstanceId: number | undefined;
  color: Color;
}

export interface Annotated {
  annotation: CSS3DObject;
}

export type InsertableObject3D = Object3D & Insertable;
export type AnnotatedObject3D = Object3D & Annotated;
export type BatchableObject3D = Mesh & Batchable;
