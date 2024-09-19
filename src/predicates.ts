import { Object3D } from "three";
import { AnnotatedObject3D, BatchableObject3D } from "./types";

export function isAnnotated(object: Object3D): object is AnnotatedObject3D {
  return "annotation" in object;
}

export function isBatchable(object: Object3D): object is BatchableObject3D {
  return "batchInstanceId" in object;
}
