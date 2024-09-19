import { BatchedMesh, BufferGeometry } from "three";
import { BatchableObject3D } from "../types";

type GeometryId = number;

class IndexedBatchedMesh {
  batchedMesh: BatchedMesh;
  geometries: Map<BufferGeometry, GeometryId>;

  constructor(batchedMesh: BatchedMesh) {
    this.batchedMesh = batchedMesh;
    this.geometries = new Map();
  }

  add(object: BatchableObject3D) {
    let geometryId;

    if (this.geometries.has(object.geometry)) {
      geometryId = this.geometries.get(object.geometry)!;
    } else {
      geometryId = this.batchedMesh.addGeometry(object.geometry);
      this.geometries.set(object.geometry, geometryId);
    }

    object.batchInstanceId = this.batchedMesh.addInstance(geometryId);

    object.updateMatrixWorld();
    this.batchedMesh.setMatrixAt(object.batchInstanceId, object.matrixWorld);

    if (object.color) {
      this.batchedMesh.setColorAt(object.batchInstanceId, object.color);
    }
  }

  setInstanceVisibility(object: BatchableObject3D, visibility: boolean) {
    if (!this.geometries.has(object.geometry) || !object.batchInstanceId) {
      console.log("Unable to find instance");
      return;
    }

    this.batchedMesh.setVisibleAt(object.batchInstanceId, visibility);
  }
}

export default IndexedBatchedMesh;
