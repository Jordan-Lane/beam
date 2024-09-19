import { BatchedMesh, Material, Scene } from "three";
import IndexedBatchMesh from "../objects/IndexedBatchMesh";
import { BatchableObject3D } from "../types";
import { isBatchable } from "../predicates";

class BatchController {
  scene: Scene;
  batchMeshes: Map<Material, IndexedBatchMesh>;

  constructor(scene: Scene) {
    this.scene = scene;
    this.batchMeshes = new Map();
  }

  add(object: BatchableObject3D) {
    if (!isBatchable(object)) {
      console.log("womp womp");
      return;
    }

    let indexedBatchedMesh;
    if (this.batchMeshes.has(object.material as Material)) {
      indexedBatchedMesh = this.batchMeshes.get(object.material as Material)!;
    } else {
      // [TODO] No idea what the values should be here - would be nice to have dynamic batch meshes... expand as more objects are added
      indexedBatchedMesh = new IndexedBatchMesh(
        new BatchedMesh(10000, 512, 1024, object.material as Material)
      );

      this.scene.add(indexedBatchedMesh.batchedMesh);
    }

    indexedBatchedMesh.add(object);
    this.batchMeshes.set(object.material as Material, indexedBatchedMesh);
  }

  setVisibility(object: BatchableObject3D, visibility: boolean) {
    if (
      !isBatchable(object) ||
      !object.batchInstanceId ||
      !this.batchMeshes.has(object.material as Material)
    ) {
      console.log("Error: unable to set instance visibility");
      return;
    }

    const indexedBatchedMesh = this.batchMeshes.get(
      object.material as Material
    )!;
    indexedBatchedMesh.setInstanceVisibility(object, visibility);
  }
}

export default BatchController;
